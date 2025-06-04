"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex gap-4 mt-4 items-center">
      <Link
        href={`?page=${currentPage - 1}`}
        className={`px-4 py-2 border rounded ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
      >
        Previous
      </Link>
      <span className="px-2 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={`?page=${currentPage + 1}`}
        className={`px-4 py-2 border rounded ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
      >
        Next
      </Link>
    </div>
  );
}
