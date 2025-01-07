import { AnimatePresence, motion } from 'framer-motion'
import { useShouldHeaderMetaShow, useIsMobile } from './hooks'
import { author } from '@/config.json'

export function AnimatedLogo() {
  const isMobile = useIsMobile()
  const shouldHeaderMetaShow = useShouldHeaderMetaShow()

  if (!isMobile) {
    return <Logo />
  }

  return (
    <AnimatePresence>
      {!shouldHeaderMetaShow && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Logo />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Logo() {
  return (
    <a 
      href="/" 
      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer min-w-max" 
      title="返回首页"
    >
      <img
        className="size-[40px] select-none object-cover rounded-2xl pointer-events-none"
        src={author.avatar}
        alt="Site owner avatar"
      />
      <span className="text-lg whitespace-nowrap pointer-events-none min-w-max">一隅天光</span>
    </a>
  )
}