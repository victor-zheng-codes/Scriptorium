import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export default function Holidays() {
  const router = useRouter();
  const { query } = router;

  // Parse query params from the URL
  const initialYear = router.query.year ? Number(router.query.year) : 2024;
  const initialProvince = router.query.province || "All";
  const initialPage = router.query.page ? Number(router.query.page) : 1;
  const initialSearch = router.query.search || "";

  console.log("Init year " + initialYear)

    // State variables
    const [year, setYear] = useState(initialYear);
    const [province, setProvince] = useState(initialProvince);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [holidays, setHolidays] = useState([]);

  const holidaysPerPage = 10;

  const provinces = [
    "AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"
  ];

  const fetchHolidays = async (selectedYear) => {
    try {
      const response = await fetch(`https://canada-holidays.ca/api/v1/holidays?year=${selectedYear}`);
      const data = await response.json();
      setHolidays(data.holidays || []);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      setHolidays([]);
    }
  };

  // Fetch holidays whenever the year changes
  useEffect(() => {
    fetchHolidays(year);
  }, [year]);

  // When the component mounts, set states from query parameters if available
  useEffect(() => {
    if (query.year) setYear(parseInt(query.year));
    if (query.province) setProvince(query.province);
    if (query.page) setCurrentPage(parseInt(query.page));
    if (query.search) setSearchTerm(query.search);
  }, [query]);

  // Update the URL query parameters whenever any of the filter values change
  useEffect(() => {
    router.replace({
      pathname: "/",
      query: {
        year,
        province,
        page: currentPage,
        search: searchTerm,
      },
    }, undefined, { shallow: true });
  }, [year, province, currentPage, searchTerm]);

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setYear(selectedYear);
    setCurrentPage(1); // Reset to first page when year changes
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setCurrentPage(1); // Reset to first page when province changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const filteredHolidays = useMemo(() => {
    return holidays.filter((holiday) => {
      const matchesProvince = province === "All" || holiday.federal || holiday.provinces.some((pr) => pr.id === province);
      const matchesSearch = holiday.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || holiday.nameFr.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesProvince && matchesSearch;
    });
  }, [holidays, province, searchTerm]);

  const totalPages = Math.ceil(filteredHolidays.length / holidaysPerPage);

  const paginatedHolidays = filteredHolidays.slice(
    (currentPage - 1) * holidaysPerPage,
    currentPage * holidaysPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <style jsx>{`
        * {
          font-family: "Arial";
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .filter-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        select, input[type="text"] {
          padding: 8px;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        th {
          background-color: #4caf50;
          color: white;
        }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        button {
          padding: 8px 16px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>

      <h1>Holidays</h1>

      <div className="filter-container">
        <label htmlFor="year-filter">Select Year:</label>
        <select id="year-filter" value={year} onChange={handleYearChange}>
          {Array.from({ length: 11 }, (_, i) => 2020 + i).map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <label htmlFor="province-filter">Select Province:</label>
        <select id="province-filter" value={province} onChange={handleProvinceChange}>
          <option value="All">All</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>

        <input
          id="holiday-search"
          type="text"
          placeholder="Search by holiday name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table id="holidays-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Name (FR)</th> 
            <th>Province(s)</th>
          </tr>
        </thead>
        <tbody>
          {paginatedHolidays.map((holiday) => (
            <tr key={holiday.id}>
              <td>{holiday.date}</td>
              <td>{holiday.nameEn}</td>
              <td>{holiday.nameFr}</td>
              <td>
                {holiday.federal
                  ? "Federal"
                  : holiday.provinces.map((pr) => pr.id).join(" ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button id="prev-page" onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button id="next-page" onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
