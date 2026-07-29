// import React from 'react'

// function Loader(){
//      return(
//         <h2>Loading products...</h2>
//      )
// }

// export default Loader;

function Loader() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-600 font-medium">
          Loading products...
        </p>
      </div>
    </div>
  );
}

export default Loader;