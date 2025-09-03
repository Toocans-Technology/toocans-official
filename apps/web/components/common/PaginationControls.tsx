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
  const pageTextCls = 'font-[Inter] text-[14px] leading-[22px] font-normal text-center text-[var(--BG-666,#666)]'
  const pageContainerBase = 'w-8 h-8 flex items-center justify-center'
  const activeItemCls = `${pageContainerBase} rounded bg-[var(--dark-brand-default,#9CFF1F)] text-[var(--BG-222222,#222)]`
  const pageButtonBase = 'w-full h-full hover:bg-transparent active:bg-transparent focus-visible:ring-0 transition-none'
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
            <PaginationItem className={currentPage === 1 ? activeItemCls : pageContainerBase}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(pageTextCls, pageButtonBase, currentPage === 1 && 'pointer-events-none')}
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
            </PaginationItem>
            {currentPage > siblingCount + 2 && <PaginationItem className={`px-2 ${pageTextCls}`}>...</PaginationItem>}
          </>
        )}

        {/* 中间页码 */}
        {pageRange.map((page) => (
          <PaginationItem key={page} className={page === currentPage ? activeItemCls : pageContainerBase}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(pageTextCls, pageButtonBase, page === currentPage && 'pointer-events-none')}
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
              <PaginationItem className={`px-2 ${pageTextCls}`}>...</PaginationItem>
            )}
            <PaginationItem className={currentPage === totalPages ? activeItemCls : pageContainerBase}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(pageTextCls, pageButtonBase, currentPage === totalPages && 'pointer-events-none')}
                onClick={() => onPageChange(totalPages)}
              >
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
