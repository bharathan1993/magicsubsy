export function StatsSection() {
  return (
    <div className="mt-32 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">100+</div>
          <div className="text-gray-600 mt-2">Supported Services</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in delay-100">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">30%</div>
          <div className="text-gray-600 mt-2">Average Savings</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 animate-fade-in delay-200">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">50K+</div>
          <div className="text-gray-600 mt-2">Happy Users</div>
        </div>
      </div>
    </div>
  );
}