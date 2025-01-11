import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaPlus, FaMinus } from "react-icons/fa";
import Caret from "./caret";

const App = () => {

  const [incomeStatement, setIncomeStatement] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [filterDate, setFilterDate] = useState("");
  const [filterMinDate, setFilterMinDate] = useState("");
  const [filterMaxDate, setFilterMaxDate] = useState("");
  //const [filterRevenue, setFilterRevenue] = useState("");
  const [filterMinRevenue, setFilterMinRevenue] = useState("");
  const [filterMaxRevenue, setFilterMaxRevenue] = useState("");
  //const [filterNetIncome, setFilterNetIncome] = useState("");
  const [filterMinNetIncome, setFilterMinNetIncome] = useState("");
  const [filterMaxNetIncome, setFilterMaxNetIncome] = useState("");
  const [sort, setSort] = useState({ key: "", direction: "asc " });
  const [dateOpen, setDateOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [netIncomeOpen, setNetIncomeOpen] = useState(false);

  const sortTable = (column) => {
    let direction = "asc";
    if (sort.key === column && sort.direction === "asc") {
      direction = "des";
    }
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredData(sortedData);
    setSort({ key: column, direction });
  }

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
    if (filterMinDate || filterMaxDate) {
      const minDate = parseFloat(filterMinDate);
      const maxDate = parseFloat(filterMaxDate);
      filtered = filtered.filter(item => {
        const date = parseFloat(item.date);
        const inRange = (isNaN(minDate) || date >= minDate) &&
          (isNaN(maxDate) || date <= maxDate);
        return inRange;
      });
    }
    if (filterMinRevenue || filterMaxRevenue) {
      const minRevenue = parseFloat(filterMinRevenue);
      const maxRevenue = parseFloat(filterMaxRevenue);
      filtered = filtered.filter(item => {
        const revenue = parseFloat(item.revenue);
        const inRange = (isNaN(minRevenue) || revenue >= minRevenue) &&
          (isNaN(maxRevenue) || revenue <= maxRevenue);
        return inRange;
      });
    }
    if (filterMinNetIncome || filterMaxNetIncome) {
      const minNetIncome = parseFloat(filterMinNetIncome);
      const maxNetIncome = parseFloat(filterMaxNetIncome);
      filtered = filtered.filter(item => {
        const netIncome = parseFloat(item.netIncome);
        const inRange = (isNaN(minNetIncome) || netIncome >= minNetIncome) &&
          (isNaN(maxNetIncome) || netIncome <= maxNetIncome);
        return inRange;
      });
    }
    if (sort.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sort.key] < b[sort.key]) {
          return sort.direction === "asc" ? -1 : 1;
        }
        if (a[sort.key] > b[sort.key]) {
          return sort.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredData(filtered);
  }, [filterMaxNetIncome, filterMinNetIncome, filterMaxRevenue, filterMinRevenue,
    filterMaxDate, filterMinDate, incomeStatement, sort]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Financial Data Filtering App</h1>
        <h2 className="text-1xl font-bold text-center mb-6">AAPL (Apple) Annual Income Statements</h2>
        {loading && (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="text-center text-lg text-red-500">{error}</div>
        )}
        <div className="mb-4">
          <button
            onClick={() => setDateOpen(!dateOpen)}
            className="block text-sm font-medium text-gray-700 flex justify-between items-center"
          >
            Filter by date
            {dateOpen ? <FaMinus className="ml-2" /> : <FaPlus className="ml-2" />}
          </button>
          {dateOpen && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter min year"
                value={filterMinDate}
                onChange={(e) => setFilterMinDate(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Enter max year"
                value={filterMaxDate}
                onChange={(e) => setFilterMaxDate(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <button
            onClick={() => setRevenueOpen(!revenueOpen)}
            className="block text-sm font-medium text-gray-700 flex justify-between items-center"
          >
            Filter by revenue
            {revenueOpen ? <FaMinus className="ml-2" /> : <FaPlus className="ml-2" />}
          </button>
          {revenueOpen && (
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Enter min amount"
                value={filterMinRevenue}
                onChange={(e) => setFilterMinRevenue(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Enter max amount"
                value={filterMaxRevenue}
                onChange={(e) => setFilterMaxRevenue(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <button
            onClick={() => setNetIncomeOpen(!netIncomeOpen)}
            className="block text-sm font-medium text-gray-700 flex justify-between items-center"
          >
            Filter by net income
            {netIncomeOpen ? <FaMinus className="ml-2" /> : <FaPlus className="ml-2" />}
          </button>
          {netIncomeOpen && (
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Enter min amount"
                value={filterMinNetIncome}
                onChange={(e) => setFilterMinNetIncome(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Enter max amount"
                value={filterMaxNetIncome}
                onChange={(e) => setFilterMaxNetIncome(e.target.value)}
                className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-600 border-seperate border-spacing-0">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("date")}>
                    Date
                    {sort.key === "date" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-gray-500" /> : <FaCaretDown className="inline ml-1 text-gray-500" />
                    )}
                  </th>
                  <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("revenue")}>
                    Revenue
                    {sort.key === "revenue" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-gray-500" /> : <FaCaretDown className="inline ml-1 text-gray-500" />
                    )}
                  </th>
                  <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("netIncome")}>
                    Net Income
                    {sort.key === "netIncome" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-gray-500" /> : <FaCaretDown className="inline ml-1 text-gray-500" />
                    )}
                  </th>
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
