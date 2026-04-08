import Link from "next/link";
import { Search, Home, ShieldCheck, Key } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__tag">
          <ShieldCheck size={16} /> Verified Landlords & Listings
        </div>
        <h1 className="hero__title">
          Find Your Perfect <br />
          <span className="gradient-text">Rental Home</span>
        </h1>
        <p className="hero__sub">
          The most transparent platform connecting renters with great landlords. No hidden fees, direct communication, and verified properties.
        </p>
        
        <div className="hero__actions">
          <Link href="/listings" className="btn btn-primary btn-lg">
            Browse Listings <Search size={18} />
          </Link>
          <Link href="/register" className="btn btn-outline btn-lg">
            List Your Property
          </Link>
        </div>
        
        <div className="hero__scroll">
          <span>Scroll Down</span>
          &darr;
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-sm section-header">
          <div className="section-label">Why Us</div>
          <h2 className="section-title">Built for Transparency</h2>
          <p className="section-desc">
            We're changing the rental game by removing the middleman. Direct connections mean faster approvals, clear terms, and better relationships.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__val"><span>10k+</span></div>
            <div className="stat-card__lbl">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__val"><span>24h</span></div>
            <div className="stat-card__lbl">Average Response Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__val"><span>100%</span></div>
            <div className="stat-card__lbl">Verified Landlords</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-header">
          <div className="section-label">Get Started</div>
          <h2 className="section-title">Join Connect-2-Rent</h2>
          <p className="section-desc">
            Whether you are looking for your next home or your next great tenant, we have the tools you need.
          </p>
        </div>

        <div className="role-grid">
          <div className="role-card role-card--renter">
            <div className="role-icon">🗝️</div>
            <h3 className="role-title">I'm a Renter</h3>
            <p className="role-desc">
              Browse thousands of verified listings, contact landlords directly, and track your applications—all completely free.
            </p>
            <ul className="role-perks">
              <li>Direct messaging with property owners</li>
              <li>Save and compare favorite listings</li>
              <li>Get alerts for new properties in your area</li>
            </ul>
            <Link href="/register?role=renter" className="btn btn-secondary">Find a Home</Link>
          </div>
          
          <div className="role-card role-card--landlord">
            <div className="role-icon">🏢</div>
            <h3 className="role-title">I'm a Landlord</h3>
            <p className="role-desc">
              List your properties to millions of active renters. Screen applicants, manage messages, and fill vacancies faster.
            </p>
            <ul className="role-perks">
              <li>Detailed property listings with image galleries</li>
              <li>Built-in messaging inbox</li>
              <li>Dashboard to track listing performance</li>
            </ul>
            <Link href="/register?role=landlord" className="btn btn-primary">List a Property</Link>
          </div>
        </div>
      </section>
    </>
  );
}
