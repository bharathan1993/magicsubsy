export function StatsSection() {
  return (
    <div className="mt-32 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl shadow-lg border border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in">
          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">100+</div>
          <div className="text-gray-700 mt-2">Supported Services</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl shadow-lg border border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in delay-100">
          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">30%</div>
          <div className="text-gray-700 mt-2">Average Savings</div>
        </div>
        <div className="p-8 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl shadow-lg border border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in delay-200">
          <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">50K+</div>
          <div className="text-gray-700 mt-2">Happy Users</div>
        </div>
      </div>
    </div>
  );
}