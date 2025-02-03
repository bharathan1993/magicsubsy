import { useState, useEffect } from "react";
import { useFetchAlertPreferences, defaultPreferences } from "./alert-preferences/useFetchAlertPreferences";
import { useUpdateAlertPreferences } from "./alert-preferences/useUpdateAlertPreferences";

export const useAlertPreferences = () => {
  const [localPreferences, setLocalPreferences] = useState(defaultPreferences);
  const { data: preferences, isLoading } = useFetchAlertPreferences();
  const updatePreferences = useUpdateAlertPreferences();

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    } else if (!isLoading) {
      setLocalPreferences(defaultPreferences);
    }
  }, [preferences, isLoading]);

  // Initialize preferences only if they don't exist
  useEffect(() => {
    const initializeDefaultPreferences = async () => {
      if (!preferences && !isLoading) {
        try {
          await updatePreferences.mutateAsync(defaultPreferences);
        } catch (err) {
          console.error('Error in initialization:', err);
        }
      }
    };

    initializeDefaultPreferences();
  }, [preferences, isLoading]);

  return {
    preferences: localPreferences,
    setPreferences: setLocalPreferences,
    isLoading,
    savePreferences: updatePreferences.mutate,
    isSaving: updatePreferences.isPending
  };
};