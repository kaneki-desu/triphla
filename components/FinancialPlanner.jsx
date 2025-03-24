'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    Wallet, 
    PiggyBank, 
    TrendingUp, 
    Target, 
    Calendar, 
    Percent, 
    IndianRupee,
    ChevronDown,
    User
} from 'lucide-react';

const API_URL = process.env.VITE_AI_API||"https://triphla-2862.onrender.com/api";
console.log('API_URL:', API_URL);
const FinancialPlanner = () => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        monthlyIncome: 50000,
        monthlyExpenses: 30000,
        stepUpPercentage: 10,
        expectedBonus: 50000,
        financialGoal: '',
        investmentHorizon: 20,
        riskTolerance: 'Moderate',
        emergencyFund: 100000
    });
    const [loading, setLoading] = useState(false);
    const [PDFdownloadUrl, setDownloadUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log('Generating financial report...');
            
            const response = await fetch(`${API_URL}/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    dateOfBirth: formData.dateOfBirth,
                    income: formData.monthlyIncome,
                    expenses: formData.monthlyExpenses,
                    stepUpPercentage: formData.stepUpPercentage,
                    expectedBonus: formData.expectedBonus,
                    investment_goals: formData.financialGoal,
                    investing_period: `${formData.investmentHorizon} years`,
                    risk_appetite: formData.riskTolerance,
                    emergency_fund: formData.emergencyFund
                }),
            });
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const data = await response.json();
            console.log('Report data:', data);
            
            if (data.download_url) {
                setDownloadUrl(data.download_url);
                await handleDownloadReport();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate the report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        try {
            if (!PDFdownloadUrl) {
                throw new Error('No download URL available');
            }

            const cleanDownloadUrl = PDFdownloadUrl.replace('/api', '');
            const response = await fetch(`${API_URL}${cleanDownloadUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `financial_report_${formData.name.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download the report. Please try again.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto p-6"
        >
            <Card className="p-8 space-y-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg shadow-xl border border-white/30 dark:border-gray-700/30">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white"
                >
                    Financial Planning Form
                </motion.h2>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Name Input */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Full Name</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                        </motion.div>

                        {/* Date of Birth Input */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Date of Birth</span>
                            </label>
                            <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                        </motion.div>

                        {/* Monthly Income */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <IndianRupee className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Monthly Income</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.monthlyIncome}
                                    onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) })}
                                    min="10000"
                                    max="500000"
                                    step="10000"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center temd -sm teblack  dark:text-gray-300">₹</span>
                            </div>
                            <Slider
                                value={[formData.monthlyIncome]}
                                onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value[0] })}
                                min={10000}
                                max={500000}
                                step={10000}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>

                        {/* Monthly Expenses */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <PiggyBank className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Monthly Expenses</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.monthlyExpenses}
                                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: parseInt(e.target.value) })}
                                    min="5000"
                                    max={formData.monthlyIncome}
                                    step="5000"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center text-md  text-black  dark:text-gray-300">₹</span>
                            </div>
                            <Slider
                                value={[formData.monthlyExpenses]}
                                onValueChange={(value) => setFormData({ ...formData, monthlyExpenses: value[0] })}
                                min={5000}
                                max={formData.monthlyIncome}
                                step={5000}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>

                        {/* Step Up Percentage */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Expected Annual Income Step Up</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.stepUpPercentage}
                                    onChange={(e) => setFormData({ ...formData, stepUpPercentage: parseInt(e.target.value) })}
                                    min="0"
                                    max="30"
                                    step="1"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center text-md  text-black  dark:text-gray-300">%</span>
                            </div>
                            <Slider
                                value={[formData.stepUpPercentage]}
                                onValueChange={(value) => setFormData({ ...formData, stepUpPercentage: value[0] })}
                                min={0}
                                max={30}
                                step={1}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Expected Bonus */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <Wallet className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Expected Annual Bonus</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.expectedBonus}
                                    onChange={(e) => setFormData({ ...formData, expectedBonus: parseInt(e.target.value) })}
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center text-md  text-black  dark:text-gray-300">₹</span>
                            </div>
                            <Slider
                                value={[formData.expectedBonus]}
                                onValueChange={(value) => setFormData({ ...formData, expectedBonus: value[0] })}
                                min={0}
                                max={500000}
                                step={10000}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>

                        {/* Financial Goal */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Financial Goal</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.financialGoal}
                                onChange={(e) => setFormData({ ...formData, financialGoal: e.target.value })}
                                placeholder="e.g., Retirement, House Purchase, Children's Education"
                                className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                        </motion.div>

                        {/* Investment Horizon */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Investment Horizon</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.investmentHorizon}
                                    onChange={(e) => setFormData({ ...formData, investmentHorizon: parseInt(e.target.value) })}
                                    min="1"
                                    max="40"
                                    step="1"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center text-md  text-black  dark:text-gray-300">years</span>
                            </div>
                            <Slider
                                value={[formData.investmentHorizon]}
                                onValueChange={(value) => setFormData({ ...formData, investmentHorizon: value[0] })}
                                min={1}
                                max={40}
                                step={1}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>

                        {/* Risk Tolerance */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <Percent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Risk Tolerance</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.riskTolerance}
                                    onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                                    className="w-full appearance-none bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                                >
                                    <option value="Low">Low Risk</option>
                                    <option value="Moderate">Moderate Risk</option>
                                    <option value="High">High Risk</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700 dark:text-gray-300 pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Emergency Fund */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <PiggyBank className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span>Emergency Fund</span>
                            </label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={formData.emergencyFund}
                                    onChange={(e) => setFormData({ ...formData, emergencyFund: parseInt(e.target.value) })}
                                    min="50000"
                                    max="1000000"
                                    step="50000"
                                    className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span className="flex items-center text-md  text-black  dark:text-gray-300">₹</span>
                            </div>
                            <Slider
                                value={[formData.emergencyFund]}
                                onValueChange={(value) => setFormData({ ...formData, emergencyFund: value[0] })}
                                min={50000}
                                max={1000000}
                                step={50000}
                                className="w-full [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-gray-300 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-gray-400"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-8 py-6 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generating Report...' : 'Generate Financial Report'}
                    </Button>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default FinancialPlanner; 