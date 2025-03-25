"use client";
import { useEffect } from "react";
import axios from "axios";

export default function StockNews() {
    
    useEffect(() => {
        axios.post("http://localhost:8000/api/stock-news")
            .then(response => {
                console.log( response);
            })
            .catch(error => {
                console.error("Error fetching stock news:", error);
            });
    }, []);

    return null; // This component only logs data
}
