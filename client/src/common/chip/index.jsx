import React from 'react';

const Chip = ({ genre }) => {
  return (
    <div className='bg-pink-500 text-white font-bold py-2 px-4 rounded-full inline-block'>
      {genre}
    </div>
  );
};

export default Chip;
