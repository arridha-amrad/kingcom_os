type Props = {
  rating: number;
};

function Stars({ rating }: Props) {
  return (
    <div className="flex">
      {[...Array(Math.ceil(rating))].map((_, index) => {
        const isHalf = rating >= index + 0.5 && rating < index + 1;
        if (isHalf) {
          return (
            <svg
              key={index}
              width="9"
              height="17"
              viewBox="0 0 9 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.56594 16.9793L8.99998 13.956V0.255005L6.38077 5.89491L0.20752 6.6431L4.76201 10.8769L3.56594 16.9793Z"
                fill="#FFC633"
              />
            </svg>
          );
        }
        return (
          <svg
            key={index}
            width="19"
            height="17"
            viewBox="0 0 19 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.65058 0.255127L12.2698 5.89504L18.443 6.64322L13.8885 10.8771L15.0846 16.9794L9.65058 13.9561L4.21654 16.9794L5.41261 10.8771L0.858119 6.64322L7.03137 5.89504L9.65058 0.255127Z"
              fill="#FFC633"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default Stars;
