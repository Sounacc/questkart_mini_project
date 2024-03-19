  import React from 'react';

  function CombinedComponent({ selectedColumnsSource1, selectedColumnsSource2 }) {
    // Function to handle button click and compare array lengths
    const handleCompare = () => {
      console.log(selectedColumnsSource1);
      console.log(selectedColumnsSource2);
      if (selectedColumnsSource1.length===0 && selectedColumnsSource2.length===0) {
          alert('Please Select columns from both sources');
      } else if(selectedColumnsSource1.length === selectedColumnsSource2.length){

      }
      else {
        alert('Length is not same');
      }


    };



    return (
      <div>
        {/* Render UI or perform operations based on the selected values */}
        <button onClick={handleCompare}>Proceed</button>
      </div>
    );
  }

  export default CombinedComponent;
