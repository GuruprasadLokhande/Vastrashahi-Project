import React from "react";
import { FadeLoader, BarLoader } from "react-spinners";

const Loader = ({ loading, spinner = "scale",color="FFB396" }) => {
  return (
    <div className="text-center">
      {spinner === "scale" && (
        <BarLoader
          color={`#${color}`}
          loading={loading}
          height={8}
          width={100}
          margin={2}
        />
      )}
      {spinner === "fade" && <FadeLoader loading={loading} color="#FFB396" />}
    </div>
  );
};

export default Loader;
