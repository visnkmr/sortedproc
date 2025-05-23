"use client"

// 1. Import necessary hooks for optimization
import { useState, useMemo, useCallback, memo} from "react"

// Add imports for the info button and popups
import { Github } from "lucide-react"


import { Slider } from "../components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  intel13,
  intel14,
  amdRyzen3000,
  amdRyzen4000G,
  amdRyzen5000,
  amdRyzen7000_8000G,
  amdRyzen9000
} from "./models"
import { Delete, PinIcon, PinOff, Star, StarOff } from "lucide-react"

      export type processorData = {
  model:string
   release_year_initial: string
  p_cores: number
  e_cores: number
  total_threads: number
  manufacturing_process_node: string
  initial_price_usd_approx: number 
  socket: string
  base_power_tdp_w: number
  max_turbo_power_w: number
  p_core_base_clock_ghz: number
  p_core_boost_clock_ghz: number
  e_core_base_clock_ghz: number 
  e_core_boost_clock_ghz: number 
  l2_cache_mb: number
  l3_cache_mb: number
  notes: string
}

// 17. Move the finddataspecs function outside the component
function finddataspecs(data: processorData[]) {
  // Only run this in development mode
  if (process.env.NODE_ENV !== "production") {
    // List of properties for which you want min and max values
    const properties: (keyof processorData)[] = ["total_threads"]
    // Initialize an object to store the results
    type MinMax = { min: number; max: number }

    interface Stats {
      [key: string]: MinMax
    }

    const stats: Stats = {}

    // Initialize stats with the first element from data as reference (if available)
    if (data.length > 0) {
      properties.forEach((prop) => {
        stats[prop] = {
          min: data[0][prop] as number,
          max: data[0][prop] as number,
        }
      })
    }

    // Iterate over the data to compute min and max for each property
    data.forEach((item) => {
      properties.forEach((prop) => {
        const value = item[prop] as number
        if (value < stats[prop].min) {
          stats[prop].min = value
        }
        if (value > stats[prop].max) {
          stats[prop].max = value
        }
      })
    })

    console.log("Stats:", stats)
  }
}

// 3. Create a memoized ProcessorCard component to prevent unnecessary re-renders
type processorcardprops = {
  item: processorData,
  pinnedProcessor: processorData | null,
  setpinnedProcessor: React.Dispatch<React.SetStateAction<processorData | null>>,
  starredProcessor: string[]|null,
  starprocessor: React.Dispatch<React.SetStateAction<string[]|null>>,
}
// eslint-disable-next-line react/display-name
const ProcessorCard = memo(({ item, pinnedProcessor, setpinnedProcessor, starredProcessor, starprocessor }:processorcardprops) => {
  // Move the percentage calculation inside the memoized component
  const calculatePercentage = useCallback((value: number, reference: number) => {
    if (!reference) return 0
    return Math.round(((value - reference) / reference) * 100)
  }, [])

  return (
    <Card
      className={`${pinnedProcessor?.model === item.model ? "border-2 border-primary" : ""} ${
        pinnedProcessor?.model === item.model ? "bg-primary/5" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{item.model}</CardTitle>
          <CardDescription>
            {item.release_year_initial}
            <br />
            {item.manufacturing_process_node}
            <br />
           {item.socket}
            <br />
            {item.notes}
          </CardDescription>
        </div>
        <button
          onClick={() => setpinnedProcessor(pinnedProcessor?.model === item.model ? null : item)}
          className="p-2 rounded-full hover:bg-muted"
          title={pinnedProcessor?.model === item.model ? "Unpin this processor" : "Pin this processor for comparison"}
        >
          {pinnedProcessor?.model === item.model ? <PinIcon /> : <PinOff />}
        </button>
        <button
          onClick={() =>
            starprocessor(
              starredProcessor?.includes(item.model)
                ? starredProcessor.filter((processor) => processor !== item.model)
                : [...(starredProcessor ? starredProcessor : []), item.model],
            )
          }
          className="p-2 rounded-full hover:bg-muted"
          title={starredProcessor?.includes(item.model) ? "Unstar this processor" : "Star this processor"}
        >
          {starredProcessor?.includes(item.model) ? <Star /> : <StarOff />}
        </button>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* <p>
          Price: ${item.price?.toLocaleString() || "9999"}
          {pinnedProcessor && pinnedProcessor.model !== item.model && (
            <Badge
              className={`ml-2 ${calculatePercentage(item.price, pinnedProcessor.price) > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {calculatePercentage(item.price, pinnedProcessor.price) > 0 ? "+" : ""}
              {calculatePercentage(item.price, pinnedProcessor.price)}%
            </Badge>
          )}
        </p> */}
        <p>
    P-Cores: {item.p_cores}
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.p_cores, pinnedProcessor.p_cores)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.p_cores, pinnedProcessor.p_cores)) > 0 ? "+" : ""}
        {calculatePercentage(item.p_cores, pinnedProcessor.p_cores)}%
      </Badge>
    )}
  </p>

  {/* E-Cores */}
  <p>
    E-Cores: {item.e_cores}
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.e_cores, pinnedProcessor.e_cores)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.e_cores, pinnedProcessor.e_cores)) > 0 ? "+" : ""}
        {calculatePercentage(item.e_cores, pinnedProcessor.e_cores)}%
      </Badge>
    )}
  </p>

  {/* Total Threads */}
  <p>
    Total Threads: {item.total_threads}
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.total_threads, pinnedProcessor.total_threads)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.total_threads, pinnedProcessor.total_threads)) > 0 ? "+" : ""}
        {calculatePercentage(item.total_threads, pinnedProcessor.total_threads)}%
      </Badge>
    )}
  </p>

  {/* Initial Price (USD Approx) */}
  <p>
    Initial Price (USD Approx): ${item.initial_price_usd_approx}
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.initial_price_usd_approx, pinnedProcessor.initial_price_usd_approx)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.initial_price_usd_approx, pinnedProcessor.initial_price_usd_approx)) > 0 ? "+" : ""}
        {calculatePercentage(item.initial_price_usd_approx, pinnedProcessor.initial_price_usd_approx)}%
      </Badge>
    )}
  </p>

  {/* Base Power (TDP_W) */}
  <p>
    Base Power (TDP): {item.base_power_tdp_w} W
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.base_power_tdp_w, pinnedProcessor.base_power_tdp_w)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.base_power_tdp_w, pinnedProcessor.base_power_tdp_w)) > 0 ? "+" : ""}
        {calculatePercentage(item.base_power_tdp_w, pinnedProcessor.base_power_tdp_w)}%
      </Badge>
    )}
  </p>

  {/* Max Turbo Power (W) */}
  <p>
    Max Turbo Power: {item.max_turbo_power_w} W
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.max_turbo_power_w, pinnedProcessor.max_turbo_power_w)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.max_turbo_power_w, pinnedProcessor.max_turbo_power_w)) > 0 ? "+" : ""}
        {calculatePercentage(item.max_turbo_power_w, pinnedProcessor.max_turbo_power_w)}%
      </Badge>
    )}
  </p>

  {/* P-Core Base Clock */}
  <p>
    P-Core Base Clock: {item.p_core_base_clock_ghz} GHz
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.p_core_base_clock_ghz, pinnedProcessor.p_core_base_clock_ghz)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.p_core_base_clock_ghz, pinnedProcessor.p_core_base_clock_ghz)) > 0 ? "+" : ""}
        {calculatePercentage(item.p_core_base_clock_ghz, pinnedProcessor.p_core_base_clock_ghz)}%
      </Badge>
    )}
  </p>

  {/* P-Core Boost Clock */}
  <p>
    P-Core Boost Clock: {item.p_core_boost_clock_ghz} GHz
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.p_core_boost_clock_ghz, pinnedProcessor.p_core_boost_clock_ghz)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.p_core_boost_clock_ghz, pinnedProcessor.p_core_boost_clock_ghz)) > 0 ? "+" : ""}
        {calculatePercentage(item.p_core_boost_clock_ghz, pinnedProcessor.p_core_boost_clock_ghz)}%
      </Badge>
    )}
  </p>

  {/* E-Core Base Clock (conditional rendering if null) */}
  <p>
    E-Core Base Clock: {item.e_core_base_clock_ghz !== null ? `${item.e_core_base_clock_ghz} GHz` : "N/A"}
    {pinnedProcessor && pinnedProcessor.model !== item.model && item.e_core_base_clock_ghz !== null && pinnedProcessor.e_core_base_clock_ghz !== null && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.e_core_base_clock_ghz, pinnedProcessor.e_core_base_clock_ghz)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.e_core_base_clock_ghz, pinnedProcessor.e_core_base_clock_ghz)) > 0 ? "+" : ""}
        {calculatePercentage(item.e_core_base_clock_ghz, pinnedProcessor.e_core_base_clock_ghz)}%
      </Badge>
    )}
  </p>

  {/* E-Core Boost Clock (conditional rendering if null) */}
  <p>
    E-Core Boost Clock: {item.e_core_boost_clock_ghz !== null ? `${item.e_core_boost_clock_ghz} GHz` : "N/A"}
    {pinnedProcessor && pinnedProcessor.model !== item.model && item.e_core_boost_clock_ghz !== null && pinnedProcessor.e_core_boost_clock_ghz !== null && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.e_core_boost_clock_ghz, pinnedProcessor.e_core_boost_clock_ghz)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.e_core_boost_clock_ghz, pinnedProcessor.e_core_boost_clock_ghz)) > 0 ? "+" : ""}
        {calculatePercentage(item.e_core_boost_clock_ghz, pinnedProcessor.e_core_boost_clock_ghz)}%
      </Badge>
    )}
  </p>

  {/* L2 Cache */}
  <p>
    L2 Cache: {item.l2_cache_mb} MB
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.l2_cache_mb, pinnedProcessor.l2_cache_mb)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.l2_cache_mb, pinnedProcessor.l2_cache_mb)) > 0 ? "+" : ""}
        {calculatePercentage(item.l2_cache_mb, pinnedProcessor.l2_cache_mb)}%
      </Badge>
    )}
  </p>

  {/* L3 Cache */}
  <p>
    L3 Cache: {item.l3_cache_mb} MB
    {pinnedProcessor && pinnedProcessor.model !== item.model && (
      <Badge
        className={`ml-2 ${(calculatePercentage(item.l3_cache_mb, pinnedProcessor.l3_cache_mb)) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {(calculatePercentage(item.l3_cache_mb, pinnedProcessor.l3_cache_mb)) > 0 ? "+" : ""}
        {calculatePercentage(item.l3_cache_mb, pinnedProcessor.l3_cache_mb)}%
      </Badge>
    )}
  </p>
      
      </CardContent>
    </Card>
  )
})

// 4. Replace the main component with optimized version
export default function VehicleDimensions() {
  // 5. Move finddataspecs outside the component to prevent recalculation on every render
  const [dimensions, setDimensions] = useState({
    // Core and Thread Counts
    p_cores: [0, 32], // Min 0 (or 2 if always present), Max 32 (or higher if future processors have more)
    e_cores: [0, 24], // Min 0, Max 24
    total_threads: [0, 64], // Min 0 (or 4), Max 64

    // Pricing
    initial_price_usd_approx: [50, 1000], // Example range: $50 to $1000

    // Power
    base_power_tdp_w: [35, 150], // Example range: 35W to 150W
    max_turbo_power_w: [60, 300], // Example range: 60W to 300W

    // Clock Speeds (in GHz)
    p_core_base_clock_ghz: [0.5, 6.0], // Example range: 0.5GHz to 6.0GHz
    p_core_boost_clock_ghz: [1.0, 7.0], // Example range: 1.0GHz to 7.0GHz
    e_core_base_clock_ghz: [0.5, 5.0], // Example range: 0.5GHz to 5.0GHz (handle nulls in actual filtering logic)
    e_core_boost_clock_ghz: [1.0, 6.0], // Example range: 1.0GHz to 6.0GHz (handle nulls in actual filtering logic)

    // Cache (in MB)
    l2_cache_mb: [0, 64], // Example range: 0MB to 64MB
    l3_cache_mb: [0, 128], // Example range: 0MB to 128MB
  })
  const [pinnedProcessor, setpinnedProcessor] = useState<processorData | null>(null)
  const [starredProcessor, starprocessor] = useState<string[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<
    | "total_threads"
  >("total_threads")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("All")
  const [comparisons, setComparisons] = useState<{ field: keyof processorData; operator: ">" | "<" }[]>([])
  const [showDimensionsRange, setShowDimensionsRange] = useState(true)

  // 6. Memoize the combined data array to prevent recreation on every render
  const data = useMemo(
    () => [
      ...intel13,
      ...intel14,
      ...amdRyzen3000,
      ...amdRyzen4000G,
      ...amdRyzen5000,
      ...amdRyzen7000_8000G,
      ...amdRyzen9000
    ],
    [],
  )

  // 7. Memoize manufacturers list
  const manufacturers = useMemo(() => Array.from(new Set(data.map((processor) => processor.manufacturing_process_node))).sort(), [data])

  // 8. Memoize total processor models count
  const totalprocessorModels = useMemo(() => data.length, [data])

  // 9. Memoize initial dimensions to prevent recalculation
  const initialDimensions = useMemo(
    () => ({
      // Core and Thread Counts
      p_cores: [Math.min(...data.map((processor) => processor.p_cores)), Math.max(...data.map((processor) => processor.p_cores))],
      e_cores: [Math.min(...data.map((processor) => processor.e_cores)), Math.max(...data.map((processor) => processor.e_cores))],
      total_threads: [Math.min(...data.map((processor) => processor.total_threads)), Math.max(...data.map((processor) => processor.total_threads))],

      // Pricing
      initial_price_usd_approx: [
        Math.min(...data.map((processor) => processor.initial_price_usd_approx)),
        Math.max(...data.map((processor) => processor.initial_price_usd_approx)),
      ],

      // Power
      base_power_tdp_w: [
        Math.min(...data.map((processor) => processor.base_power_tdp_w)),
        Math.max(...data.map((processor) => processor.base_power_tdp_w)),
      ],
      max_turbo_power_w: [
        Math.min(...data.map((processor) => processor.max_turbo_power_w)),
        Math.max(...data.map((processor) => processor.max_turbo_power_w)),
      ],

      // Clock Speeds
      p_core_base_clock_ghz: [
        Math.min(...data.map((processor) => processor.p_core_base_clock_ghz)),
        Math.max(...data.map((processor) => processor.p_core_base_clock_ghz)),
      ],
      p_core_boost_clock_ghz: [
        Math.min(...data.map((processor) => processor.p_core_boost_clock_ghz)),
        Math.max(...data.map((processor) => processor.p_core_boost_clock_ghz)),
      ],
      e_core_base_clock_ghz: [
        // Filter out nulls before finding min/max
        Math.min(...data.map((processor) => processor.e_core_base_clock_ghz).filter((val) => val !== null) as number[]),
        Math.max(...data.map((processor) => processor.e_core_base_clock_ghz).filter((val) => val !== null) as number[]),
      ],
      e_core_boost_clock_ghz: [
        // Filter out nulls before finding min/max
        Math.min(...data.map((processor) => processor.e_core_boost_clock_ghz).filter((val) => val !== null) as number[]),
        Math.max(...data.map((processor) => processor.e_core_boost_clock_ghz).filter((val) => val !== null) as number[]),
      ],

      // Cache
      l2_cache_mb: [Math.min(...data.map((processor) => processor.l2_cache_mb)), Math.max(...data.map((processor) => processor.l2_cache_mb))],
      l3_cache_mb: [Math.min(...data.map((processor) => processor.l3_cache_mb)), Math.max(...data.map((processor) => processor.l3_cache_mb))],
    
    }),
    [data],
  )

  // 10. Memoize the filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        if (starredProcessor && starredProcessor?.includes(item.model)) return true
        if (pinnedProcessor && item.model === pinnedProcessor.model) return true
        if (searchQuery && !item.model.toLowerCase().includes(searchQuery.toLowerCase())) return false

        return (
         // Core and Thread Counts
    item.p_cores >= dimensions.p_cores[0] &&
    item.p_cores <= dimensions.p_cores[1] &&
    item.e_cores >= dimensions.e_cores[0] &&
    item.e_cores <= dimensions.e_cores[1] &&
    item.total_threads >= dimensions.total_threads[0] &&
    item.total_threads <= dimensions.total_threads[1] &&

    // Pricing
    item.initial_price_usd_approx >= dimensions.initial_price_usd_approx[0] &&
    item.initial_price_usd_approx <= dimensions.initial_price_usd_approx[1] &&

    // Power
    item.base_power_tdp_w >= dimensions.base_power_tdp_w[0] &&
    item.base_power_tdp_w <= dimensions.base_power_tdp_w[1] &&
    item.max_turbo_power_w >= dimensions.max_turbo_power_w[0] &&
    item.max_turbo_power_w <= dimensions.max_turbo_power_w[1] &&

    // Clock Speeds (handle nulls for E-core clocks)
    item.p_core_base_clock_ghz >= dimensions.p_core_base_clock_ghz[0] &&
    item.p_core_base_clock_ghz <= dimensions.p_core_base_clock_ghz[1] &&
    item.p_core_boost_clock_ghz >= dimensions.p_core_boost_clock_ghz[0] &&
    item.p_core_boost_clock_ghz <= dimensions.p_core_boost_clock_ghz[1] &&

    // For E-core clocks, only apply filter if the processor *has* E-cores and the dimension range is valid
    // This assumes that if a processor has e_cores: 0, then its e_core_base_clock_ghz/e_core_boost_clock_ghz will be null.
    // If you want to include processors with 0 E-cores when filtering by E-core clock ranges that start from 0,
    // you might adjust the logic.
    (item.e_cores === 0 || (
      (item.e_core_base_clock_ghz !== null && item.e_core_base_clock_ghz >= dimensions.e_core_base_clock_ghz[0] && item.e_core_base_clock_ghz <= dimensions.e_core_base_clock_ghz[1])
    )) &&
    (item.e_cores === 0 || (
      (item.e_core_boost_clock_ghz !== null && item.e_core_boost_clock_ghz >= dimensions.e_core_boost_clock_ghz[0] && item.e_core_boost_clock_ghz <= dimensions.e_core_boost_clock_ghz[1])
    )) &&

    // Cache
    item.l2_cache_mb >= dimensions.l2_cache_mb[0] &&
    item.l2_cache_mb <= dimensions.l2_cache_mb[1] &&
    item.l3_cache_mb >= dimensions.l3_cache_mb[0] &&
    item.l3_cache_mb <= dimensions.l3_cache_mb[1]
        )
      })
      .filter((item) => {
        if (starredProcessor && starredProcessor?.includes(item.model)) return true
        if (pinnedProcessor && item.model === pinnedProcessor.model) return true
        if (manufacturerFilter !== "All" && item.manufacturing_process_node !== manufacturerFilter) return false

        return comparisons.every((comparison) => {
          if (pinnedProcessor) {
            const processorValue = item[comparison.field]
            const pinnedProcessorValue = pinnedProcessor[comparison.field]

            if (comparison.operator === ">") {
              return processorValue > pinnedProcessorValue
            } else if (comparison.operator === "<") {
              return processorValue < pinnedProcessorValue
            }
          }
          return true
        })
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return sortBy === "total_threads" || sortBy === "manufacturer"
            ? a.model.localeCompare(b.model)
            : (a[sortBy] as number) - (b[sortBy] as number)
        } else {
          return sortBy === "total_threads" || sortBy === "manufacturer"
            ? b.model.localeCompare(a.model)
            : (b[sortBy] as number) - (a[sortBy] as number)
        }
      })
  }, [data, dimensions, searchQuery, manufacturerFilter, comparisons, pinnedProcessor, starredProcessor, sortBy, sortOrder])

  // 11. Use useCallback for event handlers to prevent recreation on every render
  const handleSliderChange = useCallback((value: number[], dimension: keyof typeof dimensions) => {
    setDimensions((prev) => ({
      ...prev,
      [dimension]: value,
    }))
  }, [])

  // 12. Use useCallback for the toggle dimensions function
  const toggleDimensionsRange = useCallback(() => {
    setShowDimensionsRange(!showDimensionsRange)
  }, [showDimensionsRange])

  // 13. Use useCallback for the add comparison function
  const addComparison = useCallback(() => {
    setComparisons([...comparisons, { field: "total_threads", operator: ">" }])
  }, [comparisons])

  // 14. Use useCallback for the remove comparison function
  const removeComparison = useCallback((index: number) => {
    setComparisons((prevComparisons) => prevComparisons.filter((_, i) => i !== index))
  }, [])

  // 15. Use useCallback for the update comparison function
  const updateComparison = useCallback((index: number, field: keyof processorData, operator: ">" | "<") => {
    setComparisons((prevComparisons) => {
      const newComparisons = [...prevComparisons]
      newComparisons[index] = { field, operator }
      return newComparisons
    })
  }, [])

  finddataspecs(data)

  return (
    <>
      <div className="flex flex-col gap-8 w-full mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">SortedProcessor</h1>
              <a
                href="https://github.com/visnkmr/sortedproc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>Star</span>
              </a>
            </div>
            <p>
              {filteredData.length} of {totalprocessorModels} found
            </p>
          </div>

          {/* Search, Sort, and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Processor by name..."
                className="w-full px-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-2 py-1 border rounded-md"
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
              >
                <option value="All">All Manufacturers</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className="px-2 py-1 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
               <option value="model">Sort by Model (Name)</option>
<option value="p_cores">Sort by P-Cores</option>
<option value="e_cores">Sort by E-Cores</option>
<option value="total_threads">Sort by Total Threads</option>
<option value="initial_price_usd_approx">Sort by Price (USD)</option>
<option value="base_power_tdp_w">Sort by Base Power (TDP)</option>
<option value="max_turbo_power_w">Sort by Max Turbo Power</option>
<option value="p_core_base_clock_ghz">Sort by P-Core Base Clock</option>
<option value="p_core_boost_clock_ghz">Sort by P-Core Boost Clock</option>
<option value="e_core_base_clock_ghz">Sort by E-Core Base Clock</option>
<option value="e_core_boost_clock_ghz">Sort by E-Core Boost Clock</option>
<option value="l2_cache_mb">Sort by L2 Cache (MB)</option>
<option value="l3_cache_mb">Sort by L3 Cache (MB)</option>
<option value="release_year_initial">Sort by Release Year</option>
              </select>
              <button
                className="px-3 py-1 border rounded-md flex items-center gap-1"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
          </div>

          {/* Comparison Filter */}
          {pinnedProcessor && (
            <div className="flex flex-col gap-2 items-center">
              <span>Find Processor with:</span>

              {/* Add a new comparison filter */}
              <button onClick={addComparison} className="px-2 py-1 border rounded-md">
                Add Comparison
              </button>

              {/* Display existing comparisons */}
              {comparisons.map((comparison, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <select
                    className="px-2 py-1 border rounded-md"
                    value={comparison.field}
                    onChange={(e) => updateComparison(index, e.target.value as keyof processorData, comparison.operator)}
                  >
                    <option value="p_cores">P-Cores</option>
<option value="e_cores">E-Cores</option>
<option value="total_threads">Total Threads</option>
<option value="initial_price_usd_approx">Price (USD)</option>
<option value="base_power_tdp_w">Base Power (TDP)</option>
<option value="max_turbo_power_w">Max Turbo Power</option>
<option value="p_core_base_clock_ghz">P-Core Base Clock</option>
<option value="p_core_boost_clock_ghz">P-Core Boost Clock</option>
<option value="e_core_base_clock_ghz">E-Core Base Clock</option>
<option value="e_core_boost_clock_ghz">E-Core Boost Clock</option>
<option value="l2_cache_mb">L2 Cache (MB)</option>
<option value="l3_cache_mb">L3 Cache (MB)</option>
                  </select>
                  <select
                    className="px-2 py-1 border rounded-md"
                    value={comparison.operator}
                    onChange={(e) => updateComparison(index, comparison.field, e.target.value as ">" | "<")}
                  >
                    <option value=">">&gt; {pinnedProcessor.model}</option>
                    <option value="<">&lt; {pinnedProcessor.model}</option>
                  </select>

                  {/* Remove Comparison Button */}
                  <button
                    onClick={() => removeComparison(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    <Delete />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Toggle for Dimensions Range */}
          <button className="px-3 py-1 border rounded-md" onClick={toggleDimensionsRange}>
            {showDimensionsRange ? "Hide" : "Show"} Dimensions Range
          </button>
        </div>

        {/* Dimensions Range Card */}
        {showDimensionsRange && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Processor Spec Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* --- P-Cores Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="p-cores-slider" className="text-sm font-medium">
            **P-Cores**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.p_cores[0]}</Badge>
            <Badge variant="outline">Max: {dimensions.p_cores[1]}</Badge>
          </div>
        </div>
        <Slider
          id="p-cores-slider"
          min={initialDimensions.p_cores[0]}
          max={initialDimensions.p_cores[1]}
          step={1} // P-cores are whole numbers
          value={dimensions.p_cores}
          onValueChange={(value: number[]) => handleSliderChange(value, "p_cores")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- E-Cores Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="e-cores-slider" className="text-sm font-medium">
            **E-Cores**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.e_cores[0]}</Badge>
            <Badge variant="outline">Max: {dimensions.e_cores[1]}</Badge>
          </div>
        </div>
        <Slider
          id="e-cores-slider"
          min={initialDimensions.e_cores[0]}
          max={initialDimensions.e_cores[1]}
          step={1} // E-cores are whole numbers
          value={dimensions.e_cores}
          onValueChange={(value: number[]) => handleSliderChange(value, "e_cores")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- Total Threads Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="total-threads-slider" className="text-sm font-medium">
            **Total Threads**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.total_threads[0]}</Badge>
            <Badge variant="outline">Max: {dimensions.total_threads[1]}</Badge>
          </div>
        </div>
        <Slider
          id="total-threads-slider"
          min={initialDimensions.total_threads[0]}
          max={initialDimensions.total_threads[1]}
          step={1} // Threads are whole numbers
          value={dimensions.total_threads}
          onValueChange={(value: number[]) => handleSliderChange(value, "total_threads")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- Initial Price Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="price-slider" className="text-sm font-medium">
            **Price (USD)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: ${dimensions.initial_price_usd_approx[0]}</Badge>
            <Badge variant="outline">Max: ${dimensions.initial_price_usd_approx[1]}</Badge>
          </div>
        </div>
        <Slider
          id="price-slider"
          min={initialDimensions.initial_price_usd_approx[0]}
          max={initialDimensions.initial_price_usd_approx[1]}
          step={10} // Prices typically change by larger increments
          value={dimensions.initial_price_usd_approx}
          onValueChange={(value: number[]) => handleSliderChange(value, "initial_price_usd_approx")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- Base Power (TDP) Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="base-power-slider" className="text-sm font-medium">
            **Base Power (TDP)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.base_power_tdp_w[0]}W</Badge>
            <Badge variant="outline">Max: {dimensions.base_power_tdp_w[1]}W</Badge>
          </div>
        </div>
        <Slider
          id="base-power-slider"
          min={initialDimensions.base_power_tdp_w[0]}
          max={initialDimensions.base_power_tdp_w[1]}
          step={5} // TDP usually in 5W or 10W increments
          value={dimensions.base_power_tdp_w}
          onValueChange={(value: number[]) => handleSliderChange(value, "base_power_tdp_w")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- Max Turbo Power Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="max-turbo-power-slider" className="text-sm font-medium">
            **Max Turbo Power**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.max_turbo_power_w[0]}W</Badge>
            <Badge variant="outline">Max: {dimensions.max_turbo_power_w[1]}W</Badge>
          </div>
        </div>
        <Slider
          id="max-turbo-power-slider"
          min={initialDimensions.max_turbo_power_w[0]}
          max={initialDimensions.max_turbo_power_w[1]}
          step={10}
          value={dimensions.max_turbo_power_w}
          onValueChange={(value: number[]) => handleSliderChange(value, "max_turbo_power_w")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- P-Core Base Clock Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="p-base-clock-slider" className="text-sm font-medium">
            **P-Core Base Clock (GHz)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.p_core_base_clock_ghz[0]}GHz</Badge>
            <Badge variant="outline">Max: {dimensions.p_core_base_clock_ghz[1]}GHz</Badge>
          </div>
        </div>
        <Slider
          id="p-base-clock-slider"
          min={initialDimensions.p_core_base_clock_ghz[0]}
          max={initialDimensions.p_core_base_clock_ghz[1]}
          step={0.1} // Clocks often have decimal values
          value={dimensions.p_core_base_clock_ghz}
          onValueChange={(value: number[]) => handleSliderChange(value, "p_core_base_clock_ghz")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- P-Core Boost Clock Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="p-boost-clock-slider" className="text-sm font-medium">
            **P-Core Boost Clock (GHz)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.p_core_boost_clock_ghz[0]}GHz</Badge>
            <Badge variant="outline">Max: {dimensions.p_core_boost_clock_ghz[1]}GHz</Badge>
          </div>
        </div>
        <Slider
          id="p-boost-clock-slider"
          min={initialDimensions.p_core_boost_clock_ghz[0]}
          max={initialDimensions.p_core_boost_clock_ghz[1]}
          step={0.1}
          value={dimensions.p_core_boost_clock_ghz}
          onValueChange={(value: number[]) => handleSliderChange(value, "p_core_boost_clock_ghz")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- E-Core Base Clock Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="e-base-clock-slider" className="text-sm font-medium">
            **E-Core Base Clock (GHz)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.e_core_base_clock_ghz[0]}GHz</Badge>
            <Badge variant="outline">Max: {dimensions.e_core_base_clock_ghz[1]}GHz</Badge>
          </div>
        </div>
        <Slider
          id="e-base-clock-slider"
          min={initialDimensions.e_core_base_clock_ghz[0]}
          max={initialDimensions.e_core_base_clock_ghz[1]}
          step={0.1}
          value={dimensions.e_core_base_clock_ghz}
          onValueChange={(value: number[]) => handleSliderChange(value, "e_core_base_clock_ghz")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- E-Core Boost Clock Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="e-boost-clock-slider" className="text-sm font-medium">
            **E-Core Boost Clock (GHz)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.e_core_boost_clock_ghz[0]}GHz</Badge>
            <Badge variant="outline">Max: {dimensions.e_core_boost_clock_ghz[1]}GHz</Badge>
          </div>
        </div>
        <Slider
          id="e-boost-clock-slider"
          min={initialDimensions.e_core_boost_clock_ghz[0]}
          max={initialDimensions.e_core_boost_clock_ghz[1]}
          step={0.1}
          value={dimensions.e_core_boost_clock_ghz}
          onValueChange={(value: number[]) => handleSliderChange(value, "e_core_boost_clock_ghz")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- L2 Cache Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="l2-cache-slider" className="text-sm font-medium">
            **L2 Cache (MB)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.l2_cache_mb[0]}MB</Badge>
            <Badge variant="outline">Max: {dimensions.l2_cache_mb[1]}MB</Badge>
          </div>
        </div>
        <Slider
          id="l2-cache-slider"
          min={initialDimensions.l2_cache_mb[0]}
          max={initialDimensions.l2_cache_mb[1]}
          step={1} // Cache usually in MB increments
          value={dimensions.l2_cache_mb}
          onValueChange={(value: number[]) => handleSliderChange(value, "l2_cache_mb")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* --- L3 Cache Slider --- */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="l3-cache-slider" className="text-sm font-medium">
            **L3 Cache (MB)**
          </label>
          <div className="flex gap-2">
            <Badge variant="outline">Min: {dimensions.l3_cache_mb[0]}MB</Badge>
            <Badge variant="outline">Max: {dimensions.l3_cache_mb[1]}MB</Badge>
          </div>
        </div>
        <Slider
          id="l3-cache-slider"
          min={initialDimensions.l3_cache_mb[0]}
          max={initialDimensions.l3_cache_mb[1]}
          step={1}
          value={dimensions.l3_cache_mb}
          onValueChange={(value: number[]) => handleSliderChange(value, "l3_cache_mb")}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>
            </CardContent>
          </Card>
        )}

        {/* Processor Grid - Use windowing for better performance with large lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
          {/* 16. Use the memoized ProcessorCard component for each Processor */}
          {filteredData.slice(0, 100).map((item) => (
            <ProcessorCard
              key={item.model}
              item={item}
              pinnedProcessor={pinnedProcessor}
              setpinnedProcessor={setpinnedProcessor}
              starredProcessor={starredProcessor}
              starprocessor={starprocessor}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a
              href="https://github.com/visnkmr/sortedproc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Source code availble @ GitHub
            </a>
          </div>

          <p>Submit new Processor as PR on GitHub. Thanks.</p>
          <p className="italic text-xs leading-relaxed p-4 text-black">
            Disclaimer: The information provided on this website regarding Processor specifications, features, and other
            related details is for general informational purposes only. While we strive to ensure the accuracy and
            completeness of the information, the specifications, features, and details listed are subject to change by
            the manufacturers without notice. We do not guarantee the accuracy, reliability, or completeness of the
            information provided on this site. Processor specifications and features may vary by region, model year, and other
            factors. Always verify any critical Processor details with the manufacturer or an authorized dealership
            before making purchasing decisions. We are not liable for any errors, omissions, or discrepancies in the
            information provided. By using this website, you agree that we are not responsible for any direct, indirect,
            incidental, or consequential damages arising from the use of the information provided.
          </p>
        </footer>
      </div>
    </>
  )
}

