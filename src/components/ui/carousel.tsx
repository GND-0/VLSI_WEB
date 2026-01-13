"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    setScrollSnaps(api.scrollSnapList())
    api.on("reInit", onSelect)
    api.on("select", onSelect)
    api.on("reInit", () => setScrollSnaps(api.scrollSnapList()))

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative group", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-xl"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex transition-transform duration-300",
          orientation === "horizontal" ? "-ml-3" : "-mt-3 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-3" : "pt-3",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      data-slot="carousel-previous"
      className={cn(
        "absolute z-10 flex items-center justify-center",
        "size-12 rounded-full",
        "bg-linear-to-br from-gray-900/95 to-gray-800/95",
        "border border-gray-600/50",
        "text-white shadow-2xl shadow-black/50",
        "backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:from-teal-600 hover:to-teal-700 hover:border-teal-400/50 hover:scale-110 hover:shadow-teal-500/30",
        "focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-black",
        "disabled:opacity-0 disabled:pointer-events-none disabled:scale-90",
        "opacity-0 group-hover:opacity-100",
        orientation === "horizontal"
          ? "top-1/2 left-3 -translate-y-1/2"
          : "-top-14 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="size-6" strokeWidth={2.5} />
    </button>
  )
}

function CarouselNext({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      data-slot="carousel-next"
      className={cn(
        "absolute z-10 flex items-center justify-center",
        "size-12 rounded-full",
        "bg-linear-to-br from-gray-900/95 to-gray-800/95",
        "border border-gray-600/50",
        "text-white shadow-2xl shadow-black/50",
        "backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:from-teal-600 hover:to-teal-700 hover:border-teal-400/50 hover:scale-110 hover:shadow-teal-500/30",
        "focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-black",
        "disabled:opacity-0 disabled:pointer-events-none disabled:scale-90",
        "opacity-0 group-hover:opacity-100",
        orientation === "horizontal"
          ? "top-1/2 right-3 -translate-y-1/2"
          : "-bottom-14 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="size-6" strokeWidth={2.5} />
    </button>
  )
}

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div
      data-slot="carousel-dots"
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 z-10",
        "flex items-center gap-2",
        "bg-black/60 backdrop-blur-md rounded-full px-3 py-2",
        "border border-white/10",
        className
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={cn(
            "transition-all duration-300 ease-out rounded-full",
            "focus:outline-none focus:ring-2 focus:ring-teal-400/50",
            index === selectedIndex
              ? "w-6 h-2 bg-linear-to-r from-teal-400 to-cyan-400"
              : "w-2 h-2 bg-white/40 hover:bg-white/70"
          )}
        />
      ))}
    </div>
  )
}

function CarouselCounter({ className, ...props }: React.ComponentProps<"div">) {
  const { scrollSnaps, selectedIndex } = useCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div
      data-slot="carousel-counter"
      className={cn(
        "absolute top-4 right-4 z-10",
        "flex items-center gap-1.5",
        "bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5",
        "border border-white/10",
        "text-sm font-medium text-white",
        className
      )}
      {...props}
    >
      <span className="text-teal-400">{selectedIndex + 1}</span>
      <span className="text-gray-500">/</span>
      <span className="text-gray-400">{scrollSnaps.length}</span>
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselCounter,
}
