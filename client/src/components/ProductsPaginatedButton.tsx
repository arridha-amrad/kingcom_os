import { useNavigate } from '@tanstack/react-router'

interface Props {
  totalPages: number
}

function ProductPaginatedButton({ totalPages }: Props) {
  const router = useNavigate()

  // const currentPage = Number(sp.get('page') ?? '1') ?? 1
  const currentPage = 2

  const handlePageChange = (newPage: number) => {
    // const params = new URLSearchParams(sp.toString())
    const params = '2'
    // params.set('page', newPage.toString())

    router({ to: `/products?${params.toString()}` })
  }

  const renderPageNumbers = () => {
    const page = [1, totalPages]
    const dataPage = [currentPage - 1, currentPage, currentPage + 1]
    const result = Array.from(new Set([...page, ...dataPage]))
      .filter((v) => v > 0 && v <= totalPages)
      .sort((a, b) => a - b)
    return result
  }

  const nextPage = () => {
    handlePageChange(currentPage + 1)
  }

  const prevPage = () => {
    handlePageChange(currentPage - 1)
  }

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={prevPage}
        className="flex items-center justify-center gap-2 border border-foreground/20 rounded-xl h-10 aspect-square md:aspect-auto md:px-6"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="fill-foreground stroke-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8332 6.99996H1.1665M1.1665 6.99996L6.99984 12.8333M1.1665 6.99996L6.99984 1.16663"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="lg:block hidden">Previous</span>
      </button>
      <div className="flex items-center justify-center gap-1">
        {renderPageNumbers().map((page) => (
          <button
            onClick={() => handlePageChange(page)}
            key={page}
            className={`size-10 rounded-xl cursor-pointer ${
              currentPage === page
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground '
            }`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={nextPage}
        className="flex items-center justify-center gap-2 border border-foreground/20 rounded-xl h-10 aspect-square md:aspect-auto md:px-6"
      >
        <span className="lg:block hidden">Next</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="stroke-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.1665 6.99996H12.8332M12.8332 6.99996L6.99984 1.16663M12.8332 6.99996L6.99984 12.8333"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default ProductPaginatedButton
