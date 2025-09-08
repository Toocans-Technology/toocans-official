'use client'

import { FunctionComponent, useMemo } from 'react'
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'

interface PaginationControlsProps {
  className?: string
  totalPages: number
  currentPage: number
  siblingCount?: number // 中间页码数量，默认1
  onPageChange: (page: number) => void
}

const PaginationControls: FunctionComponent<PaginationControlsProps> = ({
  className,
  totalPages,
  currentPage,
  siblingCount = 1,
  onPageChange,
}) => {
  const pageRange = useMemo(() => {
    const range: number[] = []

    const start = Math.max(1, currentPage - siblingCount)
    const end = Math.min(totalPages, currentPage + siblingCount)

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    return range
  }, [currentPage, totalPages, siblingCount])

  return (
    <Pagination className={cn('justify-end', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            size="sm"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* 左侧省略号 */}
        {currentPage > siblingCount + 1 && (
          <>
            <PaginationItem>
              <Button variant="ghost" size="sm" onClick={() => onPageChange(1)}>
                1
              </Button>
            </PaginationItem>
            {currentPage > siblingCount + 2 && (
              <PaginationItem className="text-muted-foreground px-2 text-sm">...</PaginationItem>
            )}
          </>
        )}

        {/* 中间页码 */}
        {pageRange.map((page) => (
          <PaginationItem key={page}>
            <Button
              variant={page === currentPage ? 'default' : 'ghost'}
              size="sm"
              className={cn(page === currentPage && 'pointer-events-none')}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}

        {/* 右侧省略号 */}
        {currentPage < totalPages - siblingCount && (
          <>
            {currentPage < totalPages - siblingCount - 1 && (
              <PaginationItem className="text-muted-foreground px-2 text-sm">...</PaginationItem>
            )}
            <PaginationItem>
              <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </Button>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            size="sm"
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationControls
