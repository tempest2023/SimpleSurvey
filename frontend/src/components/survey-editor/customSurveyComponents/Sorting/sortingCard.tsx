import React from "react";
import { SortingCard as SortingCardProps } from './type';

function SortingCard({
  id,
  title,
  description,
  cardImage,
  isAvailable,
}: SortingCardProps) {
  return (
    <div className="card mb-3 offset-md-3" style={{ maxWidth: "720px" }}>
      <div className="row no-gutters">
        <div className="col-md-4">
          <img src={cardImage} className="card-img" alt={title} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="card-title" style={{ fontSize: "large" }}>
              <b>{title}</b>
            </div>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Move to bin
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {/* Add menu items here */}
                </div>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortingCard;