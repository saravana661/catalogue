import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pos.png";

function Footer() {
  return (
    <footer className="text-light pt-4 mt-5" style={{ background: "#740A08" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                style={{ height: "50px", objectFit: "contain" }}
                className="me-2"
              />
              <h5 className="fw-bold mb-0">JewelSphere Online </h5>
            </div>
            <p className="small mt-2" style={{ opacity: 0.85 }}>
              Your trusted jewellery destination. Quality gold, diamond and
              silver collections with best price.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link to="/" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-chevron-right footer-link-icon"></i> Home
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-chevron-right footer-link-icon"></i> Products
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/wishlist" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-chevron-right footer-link-icon"></i> Favourites
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/cart" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-chevron-right footer-link-icon"></i> My Cart
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/admin" className="text-light text-decoration-none footer-link">
                  <i className="bi bi-chevron-right footer-link-icon"></i> Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="small mb-2">
              <i className="bi bi-geo-alt me-2"></i> Chennai, Tamil Nadu
            </p>
            <p className="small mb-2">
              <i className="bi bi-telephone me-2"></i> +91 9940344758
            </p>
            <p className="small">
              <i className="bi bi-envelope me-2"></i> saravanachanran495@gmail.com
            </p>
          </div>
        </div>

        <hr className="border-light" />

        <div className="d-flex justify-content-between align-items-center pb-3 flex-wrap">
          <span className="small" style={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} JewelSphere. All rights reserved.
          </span>

          <div className="d-flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light footer-social">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light footer-social">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-light footer-social">
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;