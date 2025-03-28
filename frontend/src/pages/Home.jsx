import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { ChevronRight } from "lucide-react";
import ActionButton from "@/components/ActionButton";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <main className="container mx-auto px-6 py-16">
        <Hero />
        <Features />
        <ActionButton />
      </main>
    </div>
  );
};

export default Home;
