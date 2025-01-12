import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

  const fetchData = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = incomeStatement;
    if (filterMinDate || filterMaxDate) {
      const minDate = filterMinDate ? new Date(filterMinDate).getTime() : null;
      const maxDate = filterMaxDate ? new Date(filterMaxDate).getTime() : null;
      filtered = filtered.filter(item => {
        const date = new Date(item.date).getTime();
        const inRange = (minDate === null || date >= minDate) &&
          (maxDate === null || date <= maxDate);
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

  const retryFetch = () => {
    setError(null);
    fetchData();
  };

  const clearFilters = () => {
    setFilterMinDate("");
    setFilterMaxDate("");
    setFilterMinRevenue("");
    setFilterMaxRevenue("");
    setFilterMinNetIncome("");
    setFilterMaxNetIncome("");
  };

  const filterApplied = () => {
    return (
      filterMinDate || filterMaxDate || filterMinRevenue || filterMaxRevenue ||
      filterMaxNetIncome || filterMinNetIncome
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Financial Data Filtering App</h1>
        <h2 className="text-1xl font-bold text-center mb-6">AAPL (Apple) Annual Income Statements</h2>
        {loading && (
          <div className="text-center font-bold text-lg text-black">Loading...</div>
        )}
        {error && (
          <div className="text-center font-bold text-lg text-red-500">
            {error} <button onClick={retryFetch} className="text-blue-500">Retry</button>
          </div>
        )}
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setDateOpen(!dateOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Date
            {dateOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {dateOpen && (
            <div className="flex flex-col md:flex-row md:space-x-4 w-full max-w-full transition-all duration-300 ease-in-out">
              <div className="flex-1">
                <DatePicker
                  selected={filterMinDate ? new Date(filterMinDate) : null}
                  onChange={(date) => setFilterMinDate(date)}
                  placeholderText="Enter min year"
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                  dateFormat="yyyy"
                  showYearPicker
                />
              </div>
              <button
                onClick={() => setFilterMinDate("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
              <div className="flex-1">
                <DatePicker
                  selected={filterMaxDate ? new Date(filterMaxDate) : null}
                  onChange={(date) => setFilterMaxDate(date)}
                  placeholderText="Enter max year"
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                  dateFormat="yyyy"
                  showYearPicker
                />
              </div>
              <button
                onClick={() => setFilterMaxDate("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setRevenueOpen(!revenueOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Revenue
            {revenueOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {revenueOpen && (
            <div className="flex flex-col md:flex-row md:space-x-4 w-full max-w-full transition-all duration-300 ease-in-out">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter min amount"
                  value={filterMinRevenue}
                  onChange={(e) => setFilterMinRevenue(e.target.value)}
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                />
              </div>
              <button
                onClick={() => setFilterMinRevenue("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter max amount"
                  value={filterMaxRevenue}
                  onChange={(e) => setFilterMaxRevenue(e.target.value)}
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                />
              </div>
              <button
                onClick={() => setFilterMaxRevenue("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setNetIncomeOpen(!netIncomeOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Net Income
            {netIncomeOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {netIncomeOpen && (
            <div className="flex flex-col md:flex-row md:space-x-4 w-full max-w-full transition-all duration-300 ease-in-out">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter min amount"
                  value={filterMinNetIncome}
                  onChange={(e) => setFilterMinNetIncome(e.target.value)}
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                />
              </div>
              <button
                onClick={() => setFilterMinNetIncome("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter max amount"
                  value={filterMaxNetIncome}
                  onChange={(e) => setFilterMaxNetIncome(e.target.value)}
                  className="mt-3 p-2 w-full border-gray-300 rounded-md box-border"
                />
              </div>
              <button
                onClick={() => setFilterMaxNetIncome("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
        {filterApplied() && (
          <div className="flex justify-between mb-4">
            <button
              onClick={clearFilters}
              className="bg-[#162055] text-white px-2 py-1 rounded-md hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        )}
        {filteredData.length === 0 && !loading && !error && (
          <div className="text-center text-lg font-bold text-gray-700">
            No data available based on current filters
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-600 border-seperate border-spacing-0">
              <thead>
                <tr className="bg-[#162055]">
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("date")}>
                    Date
                    {sort.key === "date" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("revenue")}>
                    Revenue
                    {sort.key === "revenue" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("netIncome")}>
                    Net Income
                    {sort.key === "netIncome" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  <th className="px-4 py-2 text-white">Gross Profit</th>
                  <th className="px-4 py-2 text-white">EPS</th>
                  <th className="px-4 py-2 text-white">Operating Income</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-200 odd:bg-gray-100 even:bg-white">
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
