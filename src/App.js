import React, { useState, useEffect } from "react";

const App = () => {

  const [incomeStatement, setIncomeStatement] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterRevenue, setFilterRevenue] = useState("");

  useEffect(() => {
    fetch("https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=IVD6dWnT1sjwzShUQQkujhw0TzrPoNpe")
      .then((response) => response.json())
      .then((data) => {
        setIncomeStatement(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = incomeStatement;
    if (filterDate) {
      filtered = filtered.filter(item => item.date.includes(filterDate));
    }
    if (filterRevenue) {
      const revenueFilterVal = parseFloat(filterRevenue);
      if (!isNaN(revenueFilterVal)) {
        filtered = filtered.filter(item => parseFloat(item.revenue) >= revenueFilterVal);
      }
    }
    setFilteredData(filtered);
  }, [filterRevenue, filterDate, incomeStatement]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Financial Data Filtering App</h1>
        {loading && (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="text-center text-lg text-red-500">{error}</div>
        )}
        <div className="mb-4">
          <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">Filter by date</label>
          <input
            type="text"
            id="dateFilter"
            placeholder="Enter year"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="revenueFilter" className="block text-sm font-medium text-gray-700">Filter by revenue</label>
          <input
            type="number"
            id="revenueFilter"
            placeholder="Enter amount"
            value={filterRevenue}
            onChange={(e) => setFilterRevenue(e.target.value)}
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-600 border-seperate border-spacing-0">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Revenue</th>
                  <th className="px-4 py-2">Net Income</th>
                  <th className="px-4 py-2">Gross Profit</th>
                  <th className="px-4 py-2">EPS</th>
                  <th className="px-4 py-2">Operating Income</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">${item.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2">${item.netIncome.toLocaleString()}</td>
                    <td className="px-4 py-2">${item.grossProfit.toLocaleString()}</td>
                    <td className="px-4 py-2">${item.eps.toFixed(2)}</td>
                    <td className="px-4 py-2">${item.operatingIncome.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
