import { CircleArrowDown, CircleArrowUp, Settings, SquareArrowUp, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FunctionComponent, useCallback } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Button,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@workspace/ui/components'
import { useT } from '@/i18n'
import { typedStorage } from '@/lib/utils'
import { useUserInfo } from '@/services/user/info'
import Link from '../Link'

const UserDropdown: FunctionComponent = () => {
  const { t } = useT('common')
  const { data } = useUserInfo()
  const router = useRouter()

  const handleCopy = useCallback(() => {
    toast.success(t('common:copySuccess'))
  }, [])

  const handleLogout = useCallback(() => {
    typedStorage.clearToken()
    router.push('/login')
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image src="/icons/user.svg" alt="User" width={24} height={24} className="cursor-pointer hover:opacity-80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 shadow-xl" align="center" sideOffset={12}>
        <DropdownMenuLabel className="flex items-center gap-2 py-2.5 hover:bg-transparent">
          <Image
            src={data?.avatar || '/icons/user.svg'}
            alt="User"
            width={28}
            height={28}
            className="max-h-7 rounded"
          />
          <div className="flex flex-col gap-1">
            <h2>{data?.loginName}</h2>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span>UID: {data?.userId}</span>
              <CopyToClipboard text={data?.userId || ''} onCopy={handleCopy}>
                <Button variant="ghost" size="icon" className="size-5" rounded="sm">
                  <Image src="/icons/copy.svg" alt="copy" width={16} height={16} />
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/overview">
            <DropdownMenuItem className="py-2.5">
              <User color="#222" />
              {t('common:overview')}
            </DropdownMenuItem>
          </Link>
          <Link href="/deposit">
            <DropdownMenuItem className="py-2.5">
              <CircleArrowDown color="#222" />
              {t('common:deposit')}
            </DropdownMenuItem>
          </Link>
          <Link href="/withdrawal">
            <DropdownMenuItem className="py-2.5">
              <CircleArrowUp color="#222" />
              {t('common:withdraw')}
            </DropdownMenuItem>
          </Link>
          <Link href="/account">
            <DropdownMenuItem className="py-2.5">
              <Settings color="#222" />
              {t('common:account')}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2.5" onClick={handleLogout}>
          <SquareArrowUp color="#222" />
          {t('common:logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
