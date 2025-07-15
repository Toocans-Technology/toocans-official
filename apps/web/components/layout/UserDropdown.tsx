import { CircleArrowDown, CircleArrowUp, PencilLine, Settings, SquareArrowUp, User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FunctionComponent, useCallback, useState } from 'react'
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
import { getQueryClient } from '@/lib/utils'
import { useUserInfo } from '@/services/user/info'
import { KycLevel } from '@/types/user'
import { ChangeAvatarModal } from '../account/modals'
import { Link } from '../common'

const UserDropdown: FunctionComponent = () => {
  const { t } = useT('common')
  const { data } = useUserInfo()
  const router = useRouter()
  const queryClient = getQueryClient()
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false)

  const handleCopy = useCallback(() => {
    toast.success(t('common:copySuccess'))
  }, [t])

  const handleLogout = useCallback(() => {
    typedStorage.clearToken()
    queryClient.clear()
    router.push('/login')
  }, [queryClient, router])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image src="/icons/user.svg" alt="User" width={24} height={24} className="cursor-pointer hover:opacity-80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 shadow-xl" align="center" sideOffset={12}>
          <DropdownMenuLabel className="flex items-center gap-2 py-2.5 hover:bg-transparent">
            <div className="relative cursor-pointer overflow-hidden" onClick={() => setOpenChangeAvatarModal(true)}>
              <Image
                src={data?.avatar || '/images/avatar.png'}
                alt="User"
                width={36}
                height={36}
                className="max-h-9 rounded"
              />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white">
                <PencilLine color="#222" strokeWidth={1.5} size={8} />
              </div>
            </div>
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
              <div>
                <span className="bg-destructive inline-block rounded px-2 py-0.5 text-xs text-white">
                  {data?.kycLevel === KycLevel.unverified ? t('account:unverified') : t('account:verified')}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <Link href="/overview">
              <DropdownMenuItem className="text-foreground py-2.5">
                <User color="#222" />
                {t('common:overview')}
              </DropdownMenuItem>
            </Link>
            <Link href="/deposit">
              <DropdownMenuItem className="text-foreground py-2.5">
                <CircleArrowDown color="#222" />
                {t('common:deposit')}
              </DropdownMenuItem>
            </Link>
            <Link href="/withdrawal">
              <DropdownMenuItem className="text-foreground py-2.5">
                <CircleArrowUp color="#222" />
                {t('common:withdraw')}
              </DropdownMenuItem>
            </Link>
            <Link href="/account">
              <DropdownMenuItem className="text-foreground py-2.5">
                <Settings color="#222" />
                {t('common:account')}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-foreground py-2.5" onClick={handleLogout}>
            <SquareArrowUp color="#222" />
            {t('common:logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeAvatarModal open={openChangeAvatarModal} onOpenChange={setOpenChangeAvatarModal} />
    </>
  )
}

export default UserDropdown
