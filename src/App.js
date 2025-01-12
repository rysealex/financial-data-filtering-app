import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {

  // fetched and filtered data use states
  const [incomeStatement, setIncomeStatement] = useState([]); // holds full fetched income statement
  const [filteredData, setFilteredData] = useState([]); // holds fitlered income statement

  // loading and error feature use states
  const [loading, setLoading] = useState(true); // manages loading state (true/false)
  const [error, setError] = useState(null); // stores error messages if fetch failed

  // filtering feature use states
  const [filterMinDate, setFilterMinDate] = useState("");
  const [filterMaxDate, setFilterMaxDate] = useState("");
  const [filterMinRevenue, setFilterMinRevenue] = useState("");
  const [filterMaxRevenue, setFilterMaxRevenue] = useState("");
  const [filterMinNetIncome, setFilterMinNetIncome] = useState("");
  const [filterMaxNetIncome, setFilterMaxNetIncome] = useState("");

  // sorting and expandable/collapsable features use states
  const [sort, setSort] = useState({ key: "", direction: "asc " }); // stores sort column and direction
  const [dateOpen, setDateOpen] = useState(false); // toggle visibility of date filter
  const [revenueOpen, setRevenueOpen] = useState(false); // toggle visibility of revenue
  const [netIncomeOpen, setNetIncomeOpen] = useState(false); // toggle visibility of net income

  // fetch data from API endpoint
  const fetchData = () => {
    setLoading(true);
    fetch("https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=IVD6dWnT1sjwzShUQQkujhw0TzrPoNpe")
      .then((response) => response.json())
      .then((data) => {
        setIncomeStatement(data); // set fetched data income statement data
        setFilteredData(data); // initialize filtered data with fetched data
        setLoading(false); // set loading to false
      })
      .catch((err) => {
        setError(err.message); // if fetch failed, store error message
        setLoading(false); // set loading to false
      });
  };

  // call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // filtering data feature
  useEffect(() => {
    let filtered = incomeStatement;
    // filtering by date data
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
    // filtering by revenue data
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
    // filtering by net income data
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
    //apply sorting
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
    setFilteredData(filtered); // update filtered data state
  }, [filterMaxNetIncome, filterMinNetIncome, filterMaxRevenue, filterMinRevenue,
    filterMaxDate, filterMinDate, incomeStatement, sort]);

  // sorting table columns feature
  const sortTable = (column) => {
    let direction = "asc";
    if (sort.key === column && sort.direction === "asc") {
      direction = "des"; // toggle direction if already sorted by current column
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
    setFilteredData(sortedData); // update sorted data state
    setSort({ key: column, direction }); // update sort state
  }

  // retry feature, when fetchData fails
  const retryFetch = () => {
    setError(null); // clear error message
    fetchData(); // retry fetchData
  };

  // resets all filtered data
  const clearFilters = () => {
    setFilterMinDate("");
    setFilterMaxDate("");
    setFilterMinRevenue("");
    setFilterMaxRevenue("");
    setFilterMinNetIncome("");
    setFilterMaxNetIncome("");
  };

  // checking if any data has been filtered
  const filterApplied = () => {
    return (
      filterMinDate || filterMaxDate || filterMinRevenue || filterMaxRevenue ||
      filterMaxNetIncome || filterMinNetIncome
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">

        {/* headers here */}
        <h1 className="text-2xl font-bold text-center mb-6">Financial Data Filtering App</h1>
        <h2 className="text-1xl font-bold text-center mb-6">AAPL (Apple) Annual Income Statements</h2>

        {/* loading feature here, displays while fetched data is not present */}
        {loading && (
          <div className="text-center font-bold text-lg text-black">Loading...</div>
        )}

        {/* error feature here */}
        {error && (
          <div className="text-center font-bold text-lg text-red-500">
            {error}
            {/* retry button feature here, appears when fetchData fails */}
            <button
              onClick={retryFetch}
              className="bg-[#162055] text-white px-2 py-1 rounded-md hover:shadow-xl">
              Retry
            </button>
          </div>
        )}

        {/* filtering data features start here */}
        {/* filter by date here */}
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setDateOpen(!dateOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Date
            {/* expandable/collaspable feature here */}
            {dateOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {/* filtering data user input fields here */}
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
              {/* clear min date filtered data here */}
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
              {/* clear max date filtered data here */}
              <button
                onClick={() => setFilterMaxDate("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* filter by revenue here */}
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setRevenueOpen(!revenueOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Revenue
            {/* expandable/collaspable feature here */}
            {revenueOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {/* filtering data user input fields here */}
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
              {/* clear min revenue filtered data here */}
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
              {/* clear max revenue filtered data here */}
              <button
                onClick={() => setFilterMaxRevenue("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* filter by net income here */}
        <div className="mb-4 divide-y divide-black">
          <button
            onClick={() => setNetIncomeOpen(!netIncomeOpen)}
            className="inline-flex justify-between items-center text-sm font-bold text-gray-700 w-full"
          >
            Filter by Net Income
            {/* expandable/collaspable feature here */}
            {netIncomeOpen ? <FaMinus className="ml-2 text-gray-400 hover:text-black" /> : <FaPlus className="ml-2 text-gray-400 hover:text-black" />}
          </button>
          {/* filtering data user input fields here */}
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
              {/* clear min net income filtered data here */}
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
              {/* clear max net income filtered data here */}
              <button
                onClick={() => setFilterMaxNetIncome("")}
                className="mt-2 p-2 text-gray-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* clear filter button feature here, only appears when data is currently filtered */}
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

        {/* no data prompt feature here, only appears when filtered data is not present */}
        {filteredData.length === 0 && !loading && !error && (
          <div className="text-center text-lg font-bold text-gray-700">
            No data available based on current filters
          </div>
        )}

        {/* displaying data feature start here */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-600 border-seperate border-spacing-0">
              <thead>
                <tr className="bg-[#162055]">
                  {/* date header here */}
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("date")}>
                    Date
                    {/* sorting date data feature here, sorts by ascending/descending (caret up/ caret down) */}
                    {sort.key === "date" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  {/* revenue header here */}
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("revenue")}>
                    Revenue
                    {/* sorting revenue data feature here, sorts by ascending/descending (caret up/ caret down) */}
                    {sort.key === "revenue" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  {/* net income header here */}
                  <th className="px-4 py-2 text-white hover:shadow-xl cursor-pointer" onClick={() => sortTable("netIncome")}>
                    Net Income
                    {/* sorting net income data feature here, sorts by ascending/descending (caret up/ caret down) */}
                    {sort.key === "netIncome" && (
                      sort.direction === "asc" ? <FaCaretUp className="inline ml-1 text-white" /> : <FaCaretDown className="inline ml-1 text-white" />
                    )}
                  </th>
                  {/* gross profit, eps, and operating income headers here */}
                  <th className="px-4 py-2 text-white">Gross Profit</th>
                  <th className="px-4 py-2 text-white">EPS</th>
                  <th className="px-4 py-2 text-white">Operating Income</th>
                </tr>
              </thead>

              {/* displaying fetched data in corresponding headers here */}
              <tbody>
                {/* mapping fetched data into table here */}
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
