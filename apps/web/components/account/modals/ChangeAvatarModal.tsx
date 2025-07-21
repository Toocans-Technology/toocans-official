'use client'

import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import Cropper, { Area } from 'react-easy-crop'
import { Button, DialogFooter, Label, Separator } from '@workspace/ui/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle, toast } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'
import { useT } from '@/i18n'
import { getCroppedImg } from '@/lib/utils'
import { useUserInfo } from '@/services/user'
import { useUpdateAvatar } from '@/services/user'
import { HttpError } from '@/types/http'

const MAX_SIZE = 1024 * 1024 * 10

interface Props {
  open?: boolean
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

const ChangeAvatarModal: FunctionComponent<Props> = ({ open, disabled, onOpenChange }) => {
  const { t } = useT(['common'])
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [image, setImage] = useState('')
  const [croppedImage, setCroppedImage] = useState('')
  const { refetch } = useUserInfo()
  const { mutateAsync: updateAvatar, isPending } = useUpdateAvatar()

  useEffect(() => {
    return () => {
      setImage('')
      setCroppedImage('')
    }
  }, [open])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0 || !acceptedFiles[0]) return

      if (acceptedFiles[0].size > MAX_SIZE) {
        toast.error(t('common:changeAvatarModal.imageSizeLimit'))
        return
      }

      const url = window.URL.createObjectURL(acceptedFiles[0])
      setImage(url)
    },
    [t]
  )

  const handleCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      try {
        const croppedImg = await getCroppedImg(image, croppedAreaPixels)
        setCroppedImage(croppedImg as string)
      } catch (error) {
        console.log('error', error)
      }
    },
    [image]
  )

  const handleCancel = useCallback(() => {
    onOpenChange?.(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      const formData = new FormData()
      const blob = await fetch(croppedImage).then((res) => res.blob())
      formData.append('file', new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
      await updateAvatar(formData)

      refetch()
      toast.success(t('common:changeAvatarModal.uploadSuccess'))
      handleCancel()
    } catch (error) {
      toast.error((error as HttpError).message)
    }
  }, [refetch, croppedImage, updateAvatar, t, handleCancel])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('common:changeAvatarModal.title')}</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="mt-2 grid gap-2">
          <Label>{t('common:changeAvatarModal.uploadPhone')}</Label>
          {image ? (
            <div className="relative h-44 w-full overflow-hidden rounded">
              <Cropper
                image={image}
                crop={crop}
                aspect={1}
                zoom={zoom}
                showGrid={false}
                cropShape="round"
                cropSize={{ width: 176, height: 176 }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          ) : (
            <Dropzone onDrop={handleDrop} noKeyboard disabled={disabled}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className={cn(
                    'border-1 text-body-regular px-18 relative flex flex-col items-center justify-center rounded border-dashed border-[#bbb] bg-[#F5F5F5] py-9 text-center',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  )}
                  {...getRootProps()}
                >
                  <>
                    <input
                      {...getInputProps()}
                      type="file"
                      multiple={false}
                      className={cn(
                        'absolute z-10 h-full w-full opacity-0',
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                      )}
                      accept="image/jpeg,image/png,image/jpg"
                    />
                    <Image src="/icons/upload.svg" alt="Upload Image" width={32} height={32} />
                    <span className="mt-2 text-sm font-medium">{t('common:changeAvatarModal.description')}</span>
                    <span className="mt-5 text-xs">{t('common:changeAvatarModal.uploadTips')}</span>
                  </>
                </div>
              )}
            </Dropzone>
          )}
        </div>
        <DialogFooter>
          <Button rounded="full" variant="secondary" onClick={handleCancel}>
            {t('common:cancel')}
          </Button>
          <Button rounded="full" disabled={isPending} onClick={handleSubmit}>
            {isPending && <Loader2Icon className="animate-spin" />}
            {t('common:confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeAvatarModal
