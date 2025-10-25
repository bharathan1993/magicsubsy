import { supabase } from "@/integrations/supabase/client";

export async function debugUserState(email: string) {
  console.log("=== DEBUGGING USER STATE ===");
  console.log("Email:", email);
  
  // Check 1: Try to get user from Supabase Auth
  try {
    const { data: authUsers, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password-for-check", // This will fail but might give us info
    });
    
    console.log("Auth check result:", { authUsers, authError });
    
    // Alternative: Try to get user list (this might not work with anon key)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    console.log("User list result:", { users, listError });
    
  } catch (error) {
    console.log("Auth check error:", error);
  }
  
  // Check 2: Look for user in User Accounts table by email
  try {
    const { data: userByEmail, error: emailError } = await supabase
      .from('User Accounts')
      .select('*')
      .eq('User Name', email);
    
    console.log("User Accounts by email:", { userByEmail, emailError });
  } catch (error) {
    console.log("User Accounts email check error:", error);
  }
  
  // Check 3: Get all users from User Accounts table to see what's there
  try {
    const { data: allUsers, error: allUsersError } = await supabase
      .from('User Accounts')
      .select('user_id, "User Name"');
    
    console.log("All User Accounts:", { allUsers, allUsersError });
    
    // Check if our target email is in there
    const foundUser = allUsers?.find(user => user["User Name"] === email);
    console.log("Found user in User Accounts:", foundUser);
  } catch (error) {
    console.log("All Users check error:", error);
  }
  
  console.log("=== END DEBUGGING ===");
}

// Function to manually create a user record if needed
export async function createUserRecord(email: string, password: string) {
  try {
    // First try to sign up (this will tell us if user exists in Auth)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log("Sign up attempt:", { authData, authError });
    
    if (authData.user) {
      // New user created, create User Accounts record
      const { error: dbError } = await supabase
        .from('User Accounts')
        .insert([
          {
            user_id: authData.user.id,
            "User Name": email,
            Password: password
          }
        ]);
      
      console.log("User Accounts creation:", { dbError });
      return { success: true, message: "New user created successfully" };
    }
    
    if (authError?.message.includes("already registered")) {
      // User exists in Auth, try to get their ID
      // This is a workaround since we can't directly query auth.users with anon key
      return { success: false, message: "User already exists in Auth, need to sync" };
    }
    
    return { success: false, message: authError?.message || "Unknown error" };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, message: "Failed to create user" };
  }
}