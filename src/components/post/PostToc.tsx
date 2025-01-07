import { useAtomValue } from 'jotai'
import { startTransition, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { pageScrollLocationAtom, pageScrollDirectionAtom } from '@/store/scrollInfo'
import type { MarkdownHeading } from 'astro'

function useActiveItem() {
  const [activeItem, setActiveItem] = useState('')
  const scrollY = useAtomValue(pageScrollLocationAtom)

  useEffect(() => {
    const $article = document.querySelector('#markdown-wrapper')
    if (!$article) return
    const $headings = Array.from($article.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    
    if (scrollY === 0 && $headings.length > 0) {
      setActiveItem($headings[0].id)
      return
    }
    
    for (let i = 0; i < $headings.length; i++) {
      const item = $headings[i]
      const nextItem = $headings[i + 1]
      const itemTop = item.getBoundingClientRect().top
      const nextItemTop = nextItem ? nextItem.getBoundingClientRect().top : 10000

      if (itemTop <= 80 && nextItemTop > 80) {
        startTransition(() => {
          setActiveItem(item.id)
        })
        break
      }
    }
  }, [scrollY])

  return activeItem
}

export function PostToc({ headings }: { headings: MarkdownHeading[] }) {
  const activeItem = useActiveItem()

  return (
    <nav>
      <ul
        className="relative overflow-y-auto space-y-1 text-sm"
        style={{
          maxHeight: 'min(380px, calc(100vh - 250px))',
          scrollbarWidth: 'none',
        }}
      >
        {headings.map((item) => (
          <TocItem
            key={item.slug}
            slug={item.slug}
            text={item.text}
            depth={item.depth}
            isActive={item.slug === activeItem}
          />
        ))}
      </ul>
    </nav>
  )
}

function TocItem({
  slug,
  text,
  depth,
  isActive,
}: {
  slug: string
  text: string
  depth: number
  isActive: boolean
}) {
  const itemRef = useRef<HTMLLIElement>(null)
  const scrollDirection = useAtomValue(pageScrollDirectionAtom)

  useEffect(() => {
    if (!isActive) return
    const $item = itemRef.current
    if (!$item) return
    const $container = $item.parentElement
    if (!$container) return

    const containerHeight = $container.clientHeight
    const itemHeight = $item.clientHeight
    const itemOffsetTop = $item.offsetTop
    const scrollTop = $container.scrollTop

    const itemTop = itemOffsetTop - scrollTop
    const itemBottom = itemTop + itemHeight

    if (itemTop < 0 || itemBottom > containerHeight) {
      if (scrollDirection === 'up') {
        $container.scrollTop = itemOffsetTop - containerHeight + itemHeight
      } else {
        $container.scrollTop = itemOffsetTop
      }
    }
  }, [isActive, scrollDirection])

  return (
    <li
      className={clsx(
        "relative list-none group",
        isActive && "text-accent"
      )}
      ref={itemRef}
    >
      {/* 左侧竖线 */}
      <div 
        className={clsx(
          'absolute left-0 top-0 bottom-0 w-px transition-colors',
          isActive ? 'bg-accent' : 'bg-zinc-200 dark:bg-zinc-700'
        )}
        style={{ 
          left: `${(depth - 1) * 12}px`
        }}
      />
      {/* 横线指示器 */}
      <div
        className={clsx(
          'absolute h-px transition-colors',
          isActive ? 'bg-accent' : 'bg-zinc-200 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500'
        )}
        style={{ 
          left: `${(depth - 1) * 12}px`,
          width: '12px',
          top: '50%'
        }}
      />
      <a
        href={`#${slug}`}
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById(slug);
          if (element) {
            const offset = 80; // 导航栏高度，根据实际情况调整
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }}
        className={clsx(
          'block py-2 text-inherit no-underline transition-colors duration-200',
          !isActive && 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        )}
        style={{
          paddingLeft: `${depth * 16}px`
        }}
      >
        {text}
      </a>
    </li>
  )
}