import ReviewCard from "./Reviews/ReviewCard";

const reviews = [
  {
    id: 1,
    name: "Samantha D.",
    rating: 4.5,
    comment:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt",
    date: new Date(),
  },
  {
    id: 2,
    name: "Alex M.",
    rating: 4,
    comment:
      "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    date: new Date(),
  },
  {
    id: 3,
    name: "Ethan R.",
    rating: 3.5,
    comment:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    date: new Date(),
  },
  {
    id: 4,
    name: "Price K.",
    rating: 4.5,
    comment:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt",
    date: new Date(),
  },
  {
    id: 5,
    name: "James Mc A.",
    rating: 4,
    comment:
      "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    date: new Date(),
  },
  {
    id: 6,
    name: "John D.",
    rating: 3.5,
    comment:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    date: new Date(),
  },
];

export default function Reviews() {
  return (
    <div className="px-4">
      <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 py-6 items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-bold text-2xl">All Reviews</h1>
          <p className="leading-0">(451)</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="size-12 bg-foreground text-foreground rounded-full flex items-center justify-center">
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              className="fill-background"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.125 9.625V18.25C12.125 18.5484 12.0065 18.8345 11.7955 19.0455C11.5845 19.2565 11.2984 19.375 11 19.375C10.7016 19.375 10.4155 19.2565 10.2045 19.0455C9.99353 18.8345 9.875 18.5484 9.875 18.25V9.625C9.875 9.32663 9.99353 9.04048 10.2045 8.8295C10.4155 8.61853 10.7016 8.5 11 8.5C11.2984 8.5 11.5845 8.61853 11.7955 8.8295C12.0065 9.04048 12.125 9.32663 12.125 9.625ZM17.75 16C17.4516 16 17.1655 16.1185 16.9545 16.3295C16.7435 16.5405 16.625 16.8266 16.625 17.125V18.25C16.625 18.5484 16.7435 18.8345 16.9545 19.0455C17.1655 19.2565 17.4516 19.375 17.75 19.375C18.0484 19.375 18.3345 19.2565 18.5455 19.0455C18.7565 18.8345 18.875 18.5484 18.875 18.25V17.125C18.875 16.8266 18.7565 16.5405 18.5455 16.3295C18.3345 16.1185 18.0484 16 17.75 16ZM20 12.25H18.875V1.75C18.875 1.45163 18.7565 1.16548 18.5455 0.954505C18.3345 0.743526 18.0484 0.625 17.75 0.625C17.4516 0.625 17.1655 0.743526 16.9545 0.954505C16.7435 1.16548 16.625 1.45163 16.625 1.75V12.25H15.5C15.2016 12.25 14.9155 12.3685 14.7045 12.5795C14.4935 12.7905 14.375 13.0766 14.375 13.375C14.375 13.6734 14.4935 13.9595 14.7045 14.1705C14.9155 14.3815 15.2016 14.5 15.5 14.5H20C20.2984 14.5 20.5845 14.3815 20.7955 14.1705C21.0065 13.9595 21.125 13.6734 21.125 13.375C21.125 13.0766 21.0065 12.7905 20.7955 12.5795C20.5845 12.3685 20.2984 12.25 20 12.25ZM4.25 13C3.95163 13 3.66548 13.1185 3.4545 13.3295C3.24353 13.5405 3.125 13.8266 3.125 14.125V18.25C3.125 18.5484 3.24353 18.8345 3.4545 19.0455C3.66548 19.2565 3.95163 19.375 4.25 19.375C4.54837 19.375 4.83452 19.2565 5.0455 19.0455C5.25647 18.8345 5.375 18.5484 5.375 18.25V14.125C5.375 13.8266 5.25647 13.5405 5.0455 13.3295C4.83452 13.1185 4.54837 13 4.25 13ZM6.5 9.25H5.375V1.75C5.375 1.45163 5.25647 1.16548 5.0455 0.954505C4.83452 0.743526 4.54837 0.625 4.25 0.625C3.95163 0.625 3.66548 0.743526 3.4545 0.954505C3.24353 1.16548 3.125 1.45163 3.125 1.75V9.25H2C1.70163 9.25 1.41548 9.36853 1.2045 9.5795C0.993526 9.79048 0.875 10.0766 0.875 10.375C0.875 10.6734 0.993526 10.9595 1.2045 11.1705C1.41548 11.3815 1.70163 11.5 2 11.5H6.5C6.79837 11.5 7.08452 11.3815 7.2955 11.1705C7.50647 10.9595 7.625 10.6734 7.625 10.375C7.625 10.0766 7.50647 9.79048 7.2955 9.5795C7.08452 9.36853 6.79837 9.25 6.5 9.25ZM13.25 4.75H12.125V1.75C12.125 1.45163 12.0065 1.16548 11.7955 0.954505C11.5845 0.743526 11.2984 0.625 11 0.625C10.7016 0.625 10.4155 0.743526 10.2045 0.954505C9.99353 1.16548 9.875 1.45163 9.875 1.75V4.75H8.75C8.45163 4.75 8.16548 4.86853 7.9545 5.0795C7.74353 5.29048 7.625 5.57663 7.625 5.875C7.625 6.17337 7.74353 6.45952 7.9545 6.6705C8.16548 6.88147 8.45163 7 8.75 7H13.25C13.5484 7 13.8345 6.88147 14.0455 6.6705C14.2565 6.45952 14.375 6.17337 14.375 5.875C14.375 5.57663 14.2565 5.29048 14.0455 5.0795C13.8345 4.86853 13.5484 4.75 13.25 4.75Z" />
            </svg>
          </button>
          <button className="flex h-12 px-4 bg-foreground text-background items-center justify-center gap-3 rounded-full">
            Latest
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              className="fill-background"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.5306 1.53061L6.5306 6.53061C6.46092 6.60053 6.37813 6.65601 6.28696 6.69386C6.1958 6.73172 6.09806 6.7512 5.99935 6.7512C5.90064 6.7512 5.8029 6.73172 5.71173 6.69386C5.62057 6.65601 5.53778 6.60053 5.4681 6.53061L0.468098 1.53061C0.327202 1.38972 0.248047 1.19862 0.248047 0.999362C0.248047 0.800105 0.327202 0.609009 0.468098 0.468112C0.608994 0.327216 0.800091 0.248062 0.999348 0.248062C1.19861 0.248062 1.3897 0.327216 1.5306 0.468112L5.99997 4.93749L10.4693 0.467488C10.6102 0.326592 10.8013 0.247437 11.0006 0.247437C11.1999 0.247437 11.391 0.326592 11.5318 0.467488C11.6727 0.608384 11.7519 0.79948 11.7519 0.998738C11.7519 1.198 11.6727 1.38909 11.5318 1.52999L11.5306 1.53061Z" />
            </svg>
          </button>
          <button className="h-12 bg-foreground rounded-full text-background px-4">
            Write Review
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {reviews.map((review, i) => (
          <ReviewCard review={review} key={i} />
        ))}
      </div>
      <div className="mt-8 mx-auto w-max">
        <button className="h-13 w-[230px] font-medium rounded-full border border-foreground/20">
          Load More Reviews
        </button>
      </div>
    </div>
  );
}
