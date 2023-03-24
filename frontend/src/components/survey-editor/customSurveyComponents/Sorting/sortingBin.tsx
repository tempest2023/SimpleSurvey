import React from "react";
import { SortingBin as SortingBinProps } from "./type";

function SortingBin({ id, title }: SortingBinProps) {
  return (
    <div className="col-md-3">
      <div
        className="card bg-warning"
        style={{ width: "16rem" }}
        id={`sorting_bin_${id}`}
      >
        <div className="card-header">{title}</div>
        <ul className="list-group list-group-flush"></ul>
      </div>
    </div>
  );
}

export default SortingBin;