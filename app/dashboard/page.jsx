"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Added Header/Title
import { Progress } from "@/components/ui/progress2";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, Filter, ArrowUpDown, User, Briefcase, Calendar, Upload } from "lucide-react"; // Added Upload icon
import { useState, useEffect, useRef } from "react"; // Added useEffect, useRef

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function PortfolioDashboard() {
  const user= useSession()?.data?.user;
  const [displayedAvatarUrl, setDisplayedAvatarUrl] = useState(user?.imageUrl || ''); // State for avatar URL
  const [sortField, setSortField] = useState("ticker");
  const [sortDirection, setSortDirection] = useState("asc");
  const [riskFilter, setRiskFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false); // State for upload status
  const fileInputRef = useRef(null); // Ref for file input

  // Add test portfolio data
  const testPortfolio = [
    {"symbol": "RELIANCE.NS", "quantity": 10, "avg_price": 2500.50},
    {"symbol": "TCS.NS", "quantity": 5, "avg_price": 3500.25},
    {"symbol": "HDFCBANK.NS", "quantity": 3, "avg_price": 1500.75},
    {"symbol": "INFY.NS", "quantity": 2, "avg_price": 1600.50},
    {"symbol": "ICICIBANK.NS", "quantity": 1, "avg_price": 900.00},
    {"symbol": "HINDUNILVR.NS", "quantity": 4, "avg_price": 2500.00},
    {"symbol": "BHARTIARTL.NS", "quantity": 3, "avg_price": 1000.00},
    {"symbol": "SBIN.NS", "quantity": 5, "avg_price": 600.00},
    {"symbol": "KOTAKBANK.NS", "quantity": 2, "avg_price": 1800.00},
    {"symbol": "ITC.NS", "quantity": 4, "avg_price": 400.00}
  ];

  // Add useEffect to fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try { 
        console.log('Fetching portfolio data...');
        const response = await fetch('http://localhost:8000/analyze-portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ holdings: testPortfolio })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Portfolio Analysis Result:', data);
        // Here you can set the data to state if needed
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchPortfolioData();
  }, []); // Empty dependency array means this runs once when component mounts


  // Updated mock data for Indian market
  const userProfile = {
    age: 32,
    dematAccounts: ["Zerodha", "Groww", "Upstox"], // Common Indian brokers
  };

  const portfolio = {
    totalValue: "₹38,50,000", // Changed to INR
    dailyChange: "-1.5%",
    weeklyChange: "+2.3%",
    riskLevel: "High",
    diversification: "Moderate",
    marketSentiment: "Bullish",
    assetAllocation: [
      { name: "Stocks", value: 55 },
      { name: "Mutual Funds", value: 25 },
      { name: "Fixed Deposits", value: 15 }, // Added FDs, common in India
      { name: "Gold", value: 5 }, // Added Gold, popular in India
    ],
    sectors: [
      { name: "IT", value: 35 },
      { name: "Banking", value: 25 },
      { name: "FMCG", value: 15 },
      { name: "Pharma", value: 15 },
      { name: "Others", value: 10 },
    ],
    holdings: [
      { ticker: "RELIANCE", price: "₹2,450", change: "2%", risk: "Low", sentiment: "Bullish", action: "Hold" },
      { ticker: "TCS", price: "₹3,800", change: "-1.2%", risk: "Low", sentiment: "Neutral", action: "Buy More" },
      { ticker: "HDFCBANK", price: "₹1,680", change: "1.5%", risk: "Low", sentiment: "Bullish", action: "Hold" },
      { ticker: "INFY", price: "₹1,420", change: "-2.1%", risk: "Medium", sentiment: "Neutral", action: "Hold" },
      { ticker: "BAJFINANCE", price: "₹7,200", change: "3.2%", risk: "High", sentiment: "Bullish", action: "Review" },
    ],
    aiInsights: [
      "Your portfolio has high exposure to IT sector. Consider diversifying into FMCG & Manufacturing.",
      "Bank Nifty showing strong momentum. Consider increasing allocation to banking stocks.",
      "FD rates are increasing. Consider locking some funds in high-yield FDs.",
      "Gold prices are volatile. Consider SGB (Sovereign Gold Bonds) for gold exposure.",
    ],
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await response.json();
      if (result.success && result.avatarUrl) {
        // Prepend timestamp to force browser refresh if URL is the same but content changed
        setDisplayedAvatarUrl(`${result.avatarUrl}?t=${new Date().getTime()}`);
        // TODO: Add success notification/toast
        console.log("Avatar updated successfully:", result.avatarUrl);
      } else {
         throw new Error('Upload failed, invalid response from server.');
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      // TODO: Add error notification/toast
      alert(`Error uploading avatar: ${error.message}`); // Simple alert for now
    } finally {
      setIsUploading(false);
      // Reset file input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredHoldings = portfolio.holdings
    .filter(stock => riskFilter === "all" || stock.risk === riskFilter)
    .sort((a, b) => {
      // Basic sort for string/number, adjust if needed for price/change parsing
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // Add numeric comparison if needed
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 space-y-8 w-full bg-gray-100 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100" // Adjusted background and text colors
    >
      {/* User Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
       
        <div className="flex items-center space-x-4">
          {/* Avatar Upload */}

          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Welcome, { user?.name ? user.name : 'User'}!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your Indian market investments here
            </p>
          </div>
        </div>

        {/* Right side: Details + Theme Toggle + User Button */}
        <div className="flex items-center space-x-4 md:space-x-6 text-sm text-gray-600 dark:text-gray-300">
           <div className="flex items-center space-x-1">
             <Calendar size={16} />
             <span>Age: {userProfile.age}</span> {/* Note: This is still mock data */}
           </div>
           <div className="flex items-center space-x-1">
             <Briefcase size={16} />
              <span>Demat: {userProfile.dematAccounts.join(', ')}</span> {/* Note: This is still mock data */}
            </div>
          </div>
       </div>

       <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</CardTitle>
             {/* Optional: Add an icon here e.g. <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{portfolio.totalValue}</div>
             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
               <span className={`${portfolio.dailyChange.includes('-') ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                 {portfolio.dailyChange} Today
               </span>
               <span className={`${portfolio.weeklyChange.includes('-') ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                 {portfolio.weeklyChange} Week
               </span>
             </div>
           </CardContent>
         </Card>
         <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</CardTitle>
             <AlertTriangle className="h-4 w-4 text-yellow-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{portfolio.riskLevel}</div>
             <Progress value={75} className="mt-2 h-2" aria-label={`${portfolio.riskLevel} risk`} />
           </CardContent>
         </Card>
         <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Diversification</CardTitle>
             {/* Optional: Add an icon e.g. <PieChart className="h-4 w-4 text-muted-foreground" /> */}
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{portfolio.diversification}</div>
             <Progress value={60} className="mt-2 h-2" aria-label={`${portfolio.diversification} diversification`} />
           </CardContent>
         </Card>
         <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Sentiment</CardTitle>
             {portfolio.marketSentiment === "Bullish" ? (
               <TrendingUp className="h-4 w-4 text-green-500" />
             ) : (
               <TrendingDown className="h-4 w-4 text-red-500" />
             )}
           </CardHeader>
           <CardContent>
             <div className={`text-2xl font-bold ${portfolio.marketSentiment === "Bullish" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
               {portfolio.marketSentiment}
             </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall market trend</p>
           </CardContent>
         </Card>
      </div>

      {/* Asset Allocation and Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RechartsPieChart>
                  <Pie
                    data={portfolio.assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100} // Increased size
                    innerRadius={50} // Donut chart effect
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolio.assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
           <CardHeader>
             <CardTitle className="text-lg font-semibold">Sector Distribution</CardTitle>
           </CardHeader>
          <CardContent>
             <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RechartsPieChart>
                  <Pie
                    data={portfolio.sectors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100} // Increased size
                    innerRadius={50} // Donut chart effect
                    fill="#82ca9d"
                    dataKey="value"
                    nameKey="name"
                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolio.sectors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
         <CardHeader>
           <CardTitle className="text-lg font-semibold">AI Insights & Recommendations</CardTitle>
         </CardHeader>
        <CardContent>
          <div className="space-y-3"> {/* Reduced spacing */}
            {portfolio.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3"> {/* Increased spacing */}
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" /> {/* Adjusted alignment */}
                <p className="text-sm">{insight}</p> {/* Adjusted text size */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock Holdings Table */}
      <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden"> {/* Added overflow hidden */}
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4"> {/* Adjusted padding */}
           <CardTitle className="text-lg font-semibold">Holdings</CardTitle>
            <div className="flex items-center space-x-2"> {/* Reduced spacing */}
              <Filter size={16} className="text-gray-500 dark:text-gray-400"/>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" // Enhanced styling
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
         </CardHeader>
        <CardContent className="p-0"> {/* Removed padding for full-width table */}
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800"> {/* Header background */}
              <TableRow>
                <TableCell className="cursor-pointer font-medium text-gray-600 dark:text-gray-300" onClick={() => handleSort("ticker")}>
                  Stock <ArrowUpDown size={14} className="inline ml-1 opacity-50 hover:opacity-100" />
                </TableCell>
                <TableCell className="cursor-pointer font-medium text-gray-600 dark:text-gray-300" onClick={() => handleSort("price")}>
                  Price <ArrowUpDown size={14} className="inline ml-1 opacity-50 hover:opacity-100" />
                </TableCell>
                <TableCell className="cursor-pointer font-medium text-gray-600 dark:text-gray-300" onClick={() => handleSort("change")}>
                  Change <ArrowUpDown size={14} className="inline ml-1 opacity-50 hover:opacity-100" />
                </TableCell>
                <TableCell className="cursor-pointer font-medium text-gray-600 dark:text-gray-300" onClick={() => handleSort("risk")}>
                  Risk <ArrowUpDown size={14} className="inline ml-1 opacity-50 hover:opacity-100" />
                </TableCell>
                <TableCell className="cursor-pointer font-medium text-gray-600 dark:text-gray-300" onClick={() => handleSort("sentiment")}>
                  Sentiment <ArrowUpDown size={14} className="inline ml-1 opacity-50 hover:opacity-100" />
                </TableCell>
                <TableCell className="font-medium text-gray-600 dark:text-gray-300">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoldings.map((stock, index) => (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"> {/* Hover effect */}
                  <TableCell className="font-medium">{stock.ticker}</TableCell>
                  <TableCell>{stock.price}</TableCell>
                  <TableCell className={stock.change.includes('-') ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                    {stock.change}
                  </TableCell>
                  <TableCell>{stock.risk}</TableCell>
                  <TableCell className={
                    stock.sentiment === "Bullish" ? "text-green-600 dark:text-green-400" :
                    stock.sentiment === "Bearish" ? "text-red-600 dark:text-red-400" :
                    "text-gray-500 dark:text-gray-400"
                  }>
                    {stock.sentiment}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={stock.action === "Buy More" ? "default" : "outline"}> {/* Smaller button */}
                      {stock.action}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
    </>

  );
}
