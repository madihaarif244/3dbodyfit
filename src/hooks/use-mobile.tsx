
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export type DevicePreviewType = "none" | "mobile" | "tablet"

interface MobileContextType {
  isMobile: boolean
  isTablet: boolean
  devicePreview: DevicePreviewType
  setDevicePreview: (device: DevicePreviewType) => void
}

const MobileContext = React.createContext<MobileContextType | undefined>(undefined)

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isTablet, setIsTablet] = React.useState<boolean>(false)
  const [devicePreview, setDevicePreview] = React.useState<DevicePreviewType>("none")

  React.useEffect(() => {
    const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const mqlTablet = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChangeMobile = () => {
      setIsMobile(mqlMobile.matches)
    }
    
    const onChangeTablet = () => {
      setIsTablet(mqlTablet.matches)
    }
    
    mqlMobile.addEventListener("change", onChangeMobile)
    mqlTablet.addEventListener("change", onChangeTablet)
    
    setIsMobile(mqlMobile.matches)
    setIsTablet(mqlTablet.matches)
    
    return () => {
      mqlMobile.removeEventListener("change", onChangeMobile)
      mqlTablet.removeEventListener("change", onChangeTablet)
    }
  }, [])

  return (
    <MobileContext.Provider value={{ 
      isMobile: devicePreview === "mobile" || (devicePreview === "none" && isMobile),
      isTablet: devicePreview === "tablet" || (devicePreview === "none" && isTablet),
      devicePreview,
      setDevicePreview
    }}>
      {children}
    </MobileContext.Provider>
  )
}

export function useIsMobile() {
  const context = React.useContext(MobileContext)
  if (context === undefined) {
    // For backward compatibility, if used outside the provider
    const [isMobile, setIsMobile] = React.useState<boolean>(false)

    React.useEffect(() => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return () => mql.removeEventListener("change", onChange)
    }, [])

    return isMobile
  }
  return context.isMobile
}

export function useIsTablet() {
  const context = React.useContext(MobileContext)
  if (context === undefined) {
    throw new Error("useIsTablet must be used within a MobileProvider")
  }
  return context.isTablet
}

export function useDevicePreview() {
  const context = React.useContext(MobileContext)
  if (context === undefined) {
    throw new Error("useDevicePreview must be used within a MobileProvider")
  }
  return {
    devicePreview: context.devicePreview,
    setDevicePreview: context.setDevicePreview
  }
}
