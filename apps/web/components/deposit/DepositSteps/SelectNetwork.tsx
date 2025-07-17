import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components'
import { useT } from '@/i18n'

interface Network {
  id: string
  name: string
  icon?: string
  protocolName?: string
  disabled?: boolean
}

interface SelectNetworkProps {
  value: string
  networks: Network[]
  placeholder?: string
  onValueChange: (value: string) => void
}

const SelectNetwork: React.FC<SelectNetworkProps> = ({ value, networks, onValueChange, placeholder }) => {
  const { t } = useT('deposit')

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="hover:border-primary focus:border-primary w-[456px] rounded border-[#f8f8f8] bg-[#f8f8f8] px-3 py-2 data-[size=default]:h-11">
        <SelectValue placeholder={placeholder || t('deposit:selectNetwork')} />
      </SelectTrigger>
      <SelectContent>
        {networks.map((network) => (
          <SelectItem key={network.id} value={network.id} disabled={network.disabled} className="py-3 text-[#222]">
            <div className="flex items-center gap-2">
              {network.icon && (
                <Image
                  src={network.icon}
                  alt={network.name || ''}
                  width={16}
                  height={16}
                  className="overflow-hidden rounded-full"
                />
              )}
              <span>{network.name}</span>
              {network.protocolName && <span>({network.protocolName})</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectNetwork
