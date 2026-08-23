import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";

import rscPayloadMechanicsCover from "@/public/blogs-images/chapter-1/rsc-payload-mechanics-network-overhead.png";
import serverToClientCover from "@/public/blogs-images/chapter-1/server-to-client-boundary-leakage-server-only-enforcement.png";
import hydrationBottlenecksMismatchCover from "@/public/blogs-images/chapter-1/hydration-bottlenecks-mismatch-debugging-ssr-mechanics.png";
import bundleSizeBloatCover from "@/public/blogs-images/chapter-1/bundle-size-bloat-tree-shaking-pitfalls.png";
import imageAssetOptimizationCover from "@/public/blogs-images/chapter-1/image-asset-optimization-mechanics-next-image-internals.png";
import nestedLayoutsVsCover from "@/public/blogs-images/chapter-1/nested-layouts-vs-templates-client-state-retention.png";
import streamingSsrWithCover from "@/public/blogs-images/chapter-1/streaming-ssr-with-suspense-architecture.png";
import parallelInterceptingRoutesCover from "@/public/blogs-images/chapter-1/parallel-intercepting-routes-for-production-modal-architecture.png";
import nextJsFontCover from "@/public/blogs-images/chapter-1/next-js-font-script-optimization-next-font-next-script-strategy.png";
import clientMemoryLeaksCover from "@/public/blogs-images/chapter-1/client-memory-leaks-edge-cases-in-spa-navigation.png";
import ch2Topic1Cover from "@/public/blogs-images/chapter-2/topic-1.png";
import ch2Topic2Cover from "@/public/blogs-images/chapter-2/topic-2.png";
import ch2Topic3Cover from "@/public/blogs-images/chapter-2/topic-3.png";
import ch2Topic4Cover from "@/public/blogs-images/chapter-2/topic-4.png";
import ch2Topic5Cover from "@/public/blogs-images/chapter-2/topic-5.png";
import ch2Topic6Cover from "@/public/blogs-images/chapter-2/topic-6.png";
import ch2Topic7Cover from "@/public/blogs-images/chapter-2/topic-7.png";
import ch2Topic8Cover from "@/public/blogs-images/chapter-2/topic-8.png";
import ch2Topic9Cover from "@/public/blogs-images/chapter-2/topic-9.png";
import ch2Topic10Cover from "@/public/blogs-images/chapter-2/topic-10.png";
import ch3Topic1Cover from "@/public/blogs-images/chapter-3/topic-1.png";
import ch3Topic2Cover from "@/public/blogs-images/chapter-3/topic-2.png";
import ch3Topic3Cover from "@/public/blogs-images/chapter-3/topic-3.png";
import ch3Topic4Cover from "@/public/blogs-images/chapter-3/topic-4.png";
import ch3Topic5Cover from "@/public/blogs-images/chapter-3/topic-5.png";
import ch3Topic6Cover from "@/public/blogs-images/chapter-3/topic-6.png";
import ch3Topic7Cover from "@/public/blogs-images/chapter-3/topic-7.png";
import ch3Topic8Cover from "@/public/blogs-images/chapter-3/topic-8.png";
import ch3Topic9Cover from "@/public/blogs-images/chapter-3/topic-9.png";
import ch3Topic10Cover from "@/public/blogs-images/chapter-3/topic-10.png";
import ch4Topic1Cover from "@/public/blogs-images/chapter-4/topic-1.png";
import ch4Topic2Cover from "@/public/blogs-images/chapter-4/topic-2.png";
import ch4Topic3Cover from "@/public/blogs-images/chapter-4/topic-3.png";
import ch4Topic4Cover from "@/public/blogs-images/chapter-4/topic-4.png";
import ch4Topic5Cover from "@/public/blogs-images/chapter-4/topic-5.png";
import ch4Topic6Cover from "@/public/blogs-images/chapter-4/topic-6.png";
import ch4Topic7Cover from "@/public/blogs-images/chapter-4/topic-7.png";
import ch4Topic8Cover from "@/public/blogs-images/chapter-4/topic-8.png";
import ch4Topic9Cover from "@/public/blogs-images/chapter-4/topic-9.png";
import ch4Topic10Cover from "@/public/blogs-images/chapter-4/topic-10.png";
import ch5Topic1Cover from "@/public/blogs-images/chapter-5/topic-1.png";
import ch5Topic2Cover from "@/public/blogs-images/chapter-5/topic-2.png";
import ch5Topic3Cover from "@/public/blogs-images/chapter-5/topic-3.png";
import ch5Topic4Cover from "@/public/blogs-images/chapter-5/topic-4.png";
import ch5Topic5Cover from "@/public/blogs-images/chapter-5/topic-5.png";
import ch5Topic6Cover from "@/public/blogs-images/chapter-5/topic-6.png";
import ch5Topic7Cover from "@/public/blogs-images/chapter-5/topic-7.png";
import ch5Topic8Cover from "@/public/blogs-images/chapter-5/topic-8.png";
import ch5Topic9Cover from "@/public/blogs-images/chapter-5/topic-9.png";
import ch5Topic10Cover from "@/public/blogs-images/chapter-5/topic-10.png";
import type { Bi } from "@/lib/curriculum";
import FourTierCaching, {
  headings as fourTierCachingHeadings,
} from "./the-4-tier-caching-architecture-revalidation-lifecycles";
import RequestMemoizationReactCache, {
  headings as requestMemoizationReactCacheHeadings,
} from "./request-memoization-react-cache-function";
import DataCacheFetchStrategies, {
  headings as dataCacheFetchStrategiesHeadings,
} from "./data-cache-fetch-strategies-force-cache-vs-no-store-unstable-cache";
import FullRouteCacheVsDynamic, {
  headings as fullRouteCacheVsDynamicHeadings,
} from "./full-route-cache-vs-dynamic-rendering-static-vs-dynamic-routes";
import ClientRouterCache, {
  headings as clientRouterCacheHeadings,
} from "./client-side-router-cache-mechanism-in-memory-prefetching-invalidation";
import RevalidationStrategies, {
  headings as revalidationStrategiesHeadings,
} from "./revalidation-strategies-time-based-isr-vs-on-demand-revalidatepath-revalidatetag";
import CoreWebVitalsAssets, {
  headings as coreWebVitalsAssetsHeadings,
} from "./core-web-vitals-asset-optimization-next-image-next-font-next-script";
import DynamicImportsCodeSplitting, {
  headings as dynamicImportsCodeSplittingHeadings,
} from "./dynamic-imports-code-splitting-next-dynamic-vs-react-lazy-suspense";
import BundleAnalysisAuditing, {
  headings as bundleAnalysisAuditingHeadings,
} from "./bundle-analysis-performance-auditing-next-bundle-analyzer-lighthouse-core-web-vitals";
import PartialPrerendering, {
  headings as partialPrerenderingHeadings,
} from "./partial-prerendering-ppr-hybrid-rendering-architecture";
import RouteGroups, {
  headings as routeGroupsHeadings,
} from "./route-groups-folder-layout-isolation";
import DynamicAndCatchAllRoutes, {
  headings as dynamicAndCatchAllRoutesHeadings,
} from "./dynamic-routes-catch-all-optional-catch-all-segments";
import ParallelRoutes, {
  headings as parallelRoutesHeadings,
} from "./parallel-routes-slot-conditional-rendering";
import InterceptingRoutes, {
  headings as interceptingRoutesHeadings,
} from "./intercepting-routes";
import PhotoModalPattern, {
  headings as photoModalPatternHeadings,
} from "./parallel-intercepting-routes-the-photo-modal-pattern";
import NestedLayoutStatePreservation, {
  headings as nestedLayoutStatePreservationHeadings,
} from "./nested-layout-architecture-state-preservation";
import RouteLevelLoadingUi, {
  headings as routeLevelLoadingUiHeadings,
} from "./route-level-loading-ui-architecture";
import RouteLevelErrorUi, {
  headings as routeLevelErrorUiHeadings,
} from "./route-level-error-ui-architecture";
import RouteSegmentConfiguration, {
  headings as routeSegmentConfigurationHeadings,
} from "./route-segment-configuration-rendering-control";
import ComplexDashboardParallelRoutes, {
  headings as complexDashboardParallelRoutesHeadings,
} from "./complex-dashboard-architecture-with-parallel-routes";
import RscPayloadMechanics, {
  headings as rscPayloadHeadings,
} from "./rsc-payload-mechanics-network-overhead";
import ServerOnlyEnforcement, {
  headings as serverOnlyHeadings,
} from "./server-to-client-boundary-leakage-server-only-enforcement";
import HydrationMechanics, {
  headings as hydrationHeadings,
} from "./hydration-bottlenecks-mismatch-debugging-ssr-mechanics";
import BundleSizeBloat, {
  headings as bundleHeadings,
} from "./bundle-size-bloat-tree-shaking-pitfalls";
import ImageOptimization, {
  headings as imageHeadings,
} from "./image-asset-optimization-mechanics-next-image-internals";
import LayoutsVsTemplates, {
  headings as layoutsHeadings,
} from "./nested-layouts-vs-templates-client-state-retention";
import StreamingSuspense, {
  headings as streamingHeadings,
} from "./streaming-ssr-with-suspense-architecture";
import ParallelInterceptingRoutes, {
  headings as parallelHeadings,
} from "./parallel-intercepting-routes-for-production-modal-architecture";
import FontScriptOptimization, {
  headings as fontScriptHeadings,
} from "./next-js-font-script-optimization-next-font-next-script-strategy";
import ClientMemoryLeaks, {
  headings as memoryLeakHeadings,
} from "./client-memory-leaks-edge-cases-in-spa-navigation";
import CachingHierarchy, {
  headings as cachingHierarchyHeadings,
} from "./next-js-caching-hierarchy-request-flow";
import UncachedByDefault, {
  headings as uncachedByDefaultHeadings,
} from "./next-js-16-uncached-by-default-shift-explicit-caching-with-use-cache";
import RequestMemoization, {
  headings as requestMemoizationHeadings,
} from "./request-memoization-mechanics-deduplication-scope";
import RevalidationRaceConditions, {
  headings as revalidationRaceHeadings,
} from "./time-based-vs-on-demand-revalidation-race-conditions";
import TagBasedInvalidation, {
  headings as tagBasedInvalidationHeadings,
} from "./tag-based-cache-invalidation-architecture-revalidatetag-cachetag";
import DynamicEscalation, {
  headings as dynamicEscalationHeadings,
} from "./dynamic-functions-escalation-cache-opt-out-bottlenecks";
import SwrBehavior, {
  headings as swrBehaviorHeadings,
} from "./stale-while-revalidate-behavior-at-the-node-edge-server-layer";
import RouterCacheStaleness, {
  headings as routerCacheStalenessHeadings,
} from "./router-cache-invalidation-client-side-navigation-stale-data";
import ParallelDataFetching, {
  headings as parallelDataFetchingHeadings,
} from "./server-component-parallel-data-fetching-promise-all-bottlenecks";
import CachePoisoning, {
  headings as cachePoisoningHeadings,
} from "./data-security-authorization-leak-in-cached-data-cache-poisoning";
import RscArchitectureMentalModel, {
  headings as rscArchitectureMentalModelHeadings,
} from "./rsc-architecture-mental-model";
import ServerVsClientDecision, {
  headings as serverVsClientDecisionHeadings,
} from "./server-component-vs-client-component-decision-making";
import UseClientBoundary, {
  headings as useClientBoundaryHeadings,
} from "./use-client-boundary-bundle-impact";
import SerializableProps, {
  headings as serializablePropsHeadings,
} from "./serializable-props-rsc-data-transfer";
import ServerCompositionPatterns, {
  headings as serverCompositionPatternsHeadings,
} from "./server-component-composition-patterns";
import ServerInsideClient, {
  headings as serverInsideClientHeadings,
} from "./server-components-inside-client-components";
import ServerToClientDataFlow, {
  headings as serverToClientDataFlowHeadings,
} from "./data-flow-from-server-components-to-client-components";
import PayloadVsHtmlVsJs, {
  headings as payloadVsHtmlVsJsHeadings,
} from "./rsc-payload-vs-html-vs-javascript";
import ThirdPartyRscCompatibility, {
  headings as thirdPartyRscCompatibilityHeadings,
} from "./rsc-compatibility-of-third-party-components";
import ProductionRscAntiPatterns, {
  headings as productionRscAntiPatternsHeadings,
} from "./production-rsc-architecture-common-anti-patterns";

export interface ChapterHeading {
  id: string;
  label: Bi;
}

export interface LessonCover {
  /**
   * Imported statically rather than referenced by path, so the build
   * fingerprints the file and derives its dimensions. Replacing the image
   * changes its URL, which is what makes a new version actually show up
   * instead of being served from cache.
   */
  src: StaticImageData;
  alt: Bi;
}

export interface LessonContent {
  Body: ComponentType;
  headings: ChapterHeading[];
  /** Optional image shown between the lesson header and its first paragraph. */
  cover?: LessonCover;
}

/**
 * `chapterSlug/topicSlug` → the written lesson.
 * Adding an entry here also needs the same key added to `WRITTEN`
 * in `lib/curriculum.ts` so the sidebar stops showing "শীঘ্রই".
 */
export const lessonContent: Record<string, LessonContent> = {
  "nextjs-architecture-rendering/rsc-payload-mechanics-network-overhead": {
    Body: RscPayloadMechanics,
    headings: rscPayloadHeadings,
    cover: {
      src: rscPayloadMechanicsCover,
      alt: {
        bn: "RSC Payload মেকানিক্স ও নেটওয়ার্ক ওভারহেড",
        en: "RSC Payload mechanics and network overhead",
      },
    },
  },
  "nextjs-architecture-rendering/server-to-client-boundary-leakage-server-only-enforcement":
    {
      Body: ServerOnlyEnforcement,
      headings: serverOnlyHeadings,
      cover: {
        src: serverToClientCover,
        alt: {
          bn: "Server-to-Client বাউন্ডারি লিকেজ ও server-only এনফোর্সমেন্ট",
          en: "Server-to-client boundary leakage and server-only enforcement",
        },
      },
    },
  "nextjs-architecture-rendering/hydration-bottlenecks-mismatch-debugging-ssr-mechanics":
    {
      Body: HydrationMechanics,
      headings: hydrationHeadings,
      cover: {
        src: hydrationBottlenecksMismatchCover,
        alt: {
          bn: "Hydration বটলনেক, Mismatch ডিবাগিং ও SSR মেকানিক্স",
          en: "Hydration bottlenecks, mismatch debugging and SSR mechanics",
        },
      },
    },
  "nextjs-architecture-rendering/bundle-size-bloat-tree-shaking-pitfalls": {
    Body: BundleSizeBloat,
    headings: bundleHeadings,
    cover: {
      src: bundleSizeBloatCover,
      alt: {
        bn: "Bundle Size ব্লোট ও Tree-Shaking পিটফল",
        en: "Bundle Size Bloat & Tree-Shaking Pitfalls",
      },
    },
  },
  "nextjs-architecture-rendering/image-asset-optimization-mechanics-next-image-internals":
    {
      Body: ImageOptimization,
      headings: imageHeadings,
      cover: {
        src: imageAssetOptimizationCover,
        alt: {
          bn: "Image ও Asset অপটিমাইজেশন মেকানিক্স (next/image ইন্টার্নাল)",
          en: "Image & Asset Optimization Mechanics (next/image Internals)",
        },
      },
    },
  "nextjs-architecture-rendering/nested-layouts-vs-templates-client-state-retention":
    {
      Body: LayoutsVsTemplates,
      headings: layoutsHeadings,
      cover: {
        src: nestedLayoutsVsCover,
        alt: {
          bn: "Nested Layouts বনাম Templates ও ক্লায়েন্ট স্টেট রিটেনশন",
          en: "Nested Layouts vs Templates & Client State Retention",
        },
      },
    },
  "nextjs-architecture-rendering/streaming-ssr-with-suspense-architecture": {
    Body: StreamingSuspense,
    headings: streamingHeadings,
    cover: {
      src: streamingSsrWithCover,
      alt: {
        bn: "Suspense আর্কিটেকচার দিয়ে Streaming SSR",
        en: "Streaming SSR with Suspense Architecture",
      },
    },
  },
  "nextjs-architecture-rendering/parallel-intercepting-routes-for-production-modal-architecture":
    {
      Body: ParallelInterceptingRoutes,
      headings: parallelHeadings,
      cover: {
        src: parallelInterceptingRoutesCover,
        alt: {
          bn: "প্রোডাকশন Modal আর্কিটেকচারে Parallel ও Intercepting Routes",
          en: "Parallel & Intercepting Routes for Production Modal Architecture",
        },
      },
    },
  "nextjs-architecture-rendering/next-js-font-script-optimization-next-font-next-script-strategy":
    {
      Body: FontScriptOptimization,
      headings: fontScriptHeadings,
      cover: {
        src: nextJsFontCover,
        alt: {
          bn: "Next.js Font ও Script অপটিমাইজেশন (next/font ও next/script স্ট্র্যাটেজি)",
          en: "Next.js Font & Script Optimization (next/font & next/script Strategy)",
        },
      },
    },
  "nextjs-architecture-rendering/client-memory-leaks-edge-cases-in-spa-navigation":
    {
      Body: ClientMemoryLeaks,
      headings: memoryLeakHeadings,
      cover: {
        src: clientMemoryLeaksCover,
        alt: {
          bn: "ক্লায়েন্ট মেমরি লিক ও SPA নেভিগেশনের এজ কেস",
          en: "Client Memory Leaks & Edge Cases in SPA Navigation",
        },
      },
    },

  // ── Chapter 02 — Data Fetching Architecture ──────────────────────────
  "data-fetching-architecture/next-js-caching-hierarchy-request-flow": {
    Body: CachingHierarchy,
    headings: cachingHierarchyHeadings,
    cover: {
      src: ch2Topic1Cover,
      alt: {
        bn: "Next.js ক্যাশ হায়ারার্কি ও রিকোয়েস্ট ফ্লো",
        en: "Next.js Caching Hierarchy & Request Flow",
      },
    },
  },
  "data-fetching-architecture/next-js-16-uncached-by-default-shift-explicit-caching-with-use-cache":
    {
      Body: UncachedByDefault,
      headings: uncachedByDefaultHeadings,
      cover: {
        src: ch2Topic2Cover,
        alt: {
          bn: "Next.js 16-এর Uncached-by-Default শিফট ও 'use cache' দিয়ে এক্সপ্লিসিট ক্যাশিং",
          en: "Next.js 16 Uncached-by-Default Shift & Explicit Caching with 'use cache'",
        },
      },
    },
  "data-fetching-architecture/request-memoization-mechanics-deduplication-scope":
    {
      Body: RequestMemoization,
      headings: requestMemoizationHeadings,
      cover: {
        src: ch2Topic3Cover,
        alt: {
          bn: "Request Memoization মেকানিক্স ও ডিডুপ্লিকেশন স্কোপ",
          en: "Request Memoization Mechanics & Deduplication Scope",
        },
      },
    },
  "data-fetching-architecture/time-based-vs-on-demand-revalidation-race-conditions":
    {
      Body: RevalidationRaceConditions,
      headings: revalidationRaceHeadings,
      cover: {
        src: ch2Topic4Cover,
        alt: {
          bn: "Time-based বনাম On-demand রিভ্যালিডেশন ও রেস কন্ডিশন",
          en: "Time-based vs On-demand Revalidation Race Conditions",
        },
      },
    },
  "data-fetching-architecture/tag-based-cache-invalidation-architecture-revalidatetag-cachetag":
    {
      Body: TagBasedInvalidation,
      headings: tagBasedInvalidationHeadings,
      cover: {
        src: ch2Topic5Cover,
        alt: {
          bn: "Tag-based ক্যাশ ইনভ্যালিডেশন আর্কিটেকচার (revalidateTag ও cacheTag)",
          en: "Tag-based Cache Invalidation Architecture (revalidateTag & cacheTag)",
        },
      },
    },
  "data-fetching-architecture/dynamic-functions-escalation-cache-opt-out-bottlenecks":
    {
      Body: DynamicEscalation,
      headings: dynamicEscalationHeadings,
      cover: {
        src: ch2Topic6Cover,
        alt: {
          bn: "Dynamic Function এসকেলেশন ও ক্যাশ Opt-out বটলনেক",
          en: "Dynamic Functions Escalation & Cache Opt-out Bottlenecks",
        },
      },
    },
  "data-fetching-architecture/stale-while-revalidate-behavior-at-the-node-edge-server-layer":
    {
      Body: SwrBehavior,
      headings: swrBehaviorHeadings,
      cover: {
        src: ch2Topic7Cover,
        alt: {
          bn: "Node/Edge সার্ভার লেয়ারে Stale-While-Revalidate বিহেভিয়ার",
          en: "Stale-While-Revalidate Behavior at the Node/Edge Server Layer",
        },
      },
    },
  "data-fetching-architecture/router-cache-invalidation-client-side-navigation-stale-data":
    {
      Body: RouterCacheStaleness,
      headings: routerCacheStalenessHeadings,
      cover: {
        src: ch2Topic8Cover,
        alt: {
          bn: "Router Cache ইনভ্যালিডেশন ও ক্লায়েন্ট নেভিগেশনে স্টেল ডেটা",
          en: "Router Cache Invalidation & Client-Side Navigation Stale Data",
        },
      },
    },
  "data-fetching-architecture/server-component-parallel-data-fetching-promise-all-bottlenecks":
    {
      Body: ParallelDataFetching,
      headings: parallelDataFetchingHeadings,
      cover: {
        src: ch2Topic9Cover,
        alt: {
          bn: "Server Component-এ Parallel ডেটা ফেচিং ও Promise.all বটলনেক",
          en: "Server Component Parallel Data Fetching & Promise.all Bottlenecks",
        },
      },
    },
  "data-fetching-architecture/data-security-authorization-leak-in-cached-data-cache-poisoning":
    {
      Body: CachePoisoning,
      headings: cachePoisoningHeadings,
      cover: {
        src: ch2Topic10Cover,
        alt: {
          bn: "ক্যাশড ডেটায় সিকিউরিটি ও অথরাইজেশন লিক (Cache Poisoning)",
          en: "Data Security & Authorization Leak in Cached Data (Cache Poisoning)",
        },
      },
    },

  // ── Chapter 03 — React Server Components ─────────────────────────────
  "react-server-components/rsc-architecture-mental-model": {
    Body: RscArchitectureMentalModel,
    headings: rscArchitectureMentalModelHeadings,
    cover: {
      src: ch3Topic1Cover,
      alt: {
        bn: "RSC আর্কিটেকচার ও মেন্টাল মডেল",
        en: "RSC Architecture & Mental Model",
      },
    },
  },
  "react-server-components/server-component-vs-client-component-decision-making":
    {
      Body: ServerVsClientDecision,
      headings: serverVsClientDecisionHeadings,
      cover: {
        src: ch3Topic2Cover,
        alt: {
          bn: "Server Component বনাম Client Component — ডিসিশন মেকিং",
          en: "Server Component vs Client Component Decision Making",
        },
      },
    },
  "react-server-components/use-client-boundary-bundle-impact": {
    Body: UseClientBoundary,
    headings: useClientBoundaryHeadings,
    cover: {
      src: ch3Topic3Cover,
      alt: {
        bn: '"use client" বাউন্ডারি ও বান্ডল ইমপ্যাক্ট',
        en: '"use client" Boundary & Bundle Impact',
      },
    },
  },
  "react-server-components/serializable-props-rsc-data-transfer": {
    Body: SerializableProps,
    headings: serializablePropsHeadings,
    cover: {
      src: ch3Topic4Cover,
      alt: {
        bn: "Serializable Props ও RSC ডেটা ট্রান্সফার",
        en: "Serializable Props & RSC Data Transfer",
      },
    },
  },
  "react-server-components/server-component-composition-patterns": {
    Body: ServerCompositionPatterns,
    headings: serverCompositionPatternsHeadings,
    cover: {
      src: ch3Topic5Cover,
      alt: {
        bn: "Server Component কম্পোজিশন প্যাটার্ন",
        en: "Server Component Composition Patterns",
      },
    },
  },

  "react-server-components/server-components-inside-client-components": {
    Body: ServerInsideClient,
    headings: serverInsideClientHeadings,
    cover: {
      src: ch3Topic6Cover,
      alt: {
        bn: "Client Component-এর ভিতরে Server Component প্যাটার্ন",
        en: "Server Components Inside Client Components",
      },
    },
  },
  "react-server-components/data-flow-from-server-components-to-client-components":
    {
      Body: ServerToClientDataFlow,
      headings: serverToClientDataFlowHeadings,
      cover: {
        src: ch3Topic7Cover,
        alt: {
          bn: "Server Component থেকে Client Component-এ ডেটা ফ্লো",
          en: "Data Flow from Server Components to Client Components",
        },
      },
    },
  "react-server-components/rsc-payload-vs-html-vs-javascript": {
    Body: PayloadVsHtmlVsJs,
    headings: payloadVsHtmlVsJsHeadings,
    cover: {
      src: ch3Topic8Cover,
      alt: {
        bn: "RSC Payload বনাম HTML বনাম JavaScript",
        en: "RSC Payload vs HTML vs JavaScript",
      },
    },
  },
  "react-server-components/rsc-compatibility-of-third-party-components": {
    Body: ThirdPartyRscCompatibility,
    headings: thirdPartyRscCompatibilityHeadings,
    cover: {
      src: ch3Topic9Cover,
      alt: {
        bn: "থার্ড-পার্টি কম্পোনেন্টের RSC কম্প্যাটিবিলিটি",
        en: "RSC Compatibility of Third-party Components",
      },
    },
  },
  "react-server-components/production-rsc-architecture-common-anti-patterns": {
    Body: ProductionRscAntiPatterns,
    headings: productionRscAntiPatternsHeadings,
    cover: {
      src: ch3Topic10Cover,
      alt: {
        bn: "প্রোডাকশন RSC আর্কিটেকচার ও কমন অ্যান্টি-প্যাটার্ন",
        en: "Production RSC Architecture & Common Anti-patterns",
      },
    },
  },

  // ── Chapter 04 — Caching & Performance ───────────────────────────────
  "caching-performance/the-4-tier-caching-architecture-revalidation-lifecycles":
    {
      Body: FourTierCaching,
      headings: fourTierCachingHeadings,
      cover: {
        src: ch4Topic1Cover,
        alt: {
          bn: "৪-স্তরের ক্যাশিং আর্কিটেকচার ও রিভ্যালিডেশন লাইফসাইকেল",
          en: "The 4-Tier Caching Architecture & Revalidation Lifecycles",
        },
      },
    },
  "caching-performance/request-memoization-react-cache-function": {
    Body: RequestMemoizationReactCache,
    headings: requestMemoizationReactCacheHeadings,
    cover: {
      src: ch4Topic2Cover,
      alt: {
        bn: "Request Memoization ও React cache() ফাংশন",
        en: "Request Memoization & React cache() Function",
      },
    },
  },
  "caching-performance/data-cache-fetch-strategies-force-cache-vs-no-store-unstable-cache":
    {
      Body: DataCacheFetchStrategies,
      headings: dataCacheFetchStrategiesHeadings,
      cover: {
        src: ch4Topic3Cover,
        alt: {
          bn: "Data Cache ও Fetch Strategy (force-cache বনাম no-store, unstable_cache)",
          en: "Data Cache & Fetch Strategies (force-cache vs no-store, unstable_cache)",
        },
      },
    },
  "caching-performance/full-route-cache-vs-dynamic-rendering-static-vs-dynamic-routes":
    {
      Body: FullRouteCacheVsDynamic,
      headings: fullRouteCacheVsDynamicHeadings,
      cover: {
        src: ch4Topic4Cover,
        alt: {
          bn: "Full Route Cache বনাম Dynamic Rendering (Static বনাম Dynamic Routes)",
          en: "Full Route Cache vs Dynamic Rendering (Static vs Dynamic Routes)",
        },
      },
    },
  "caching-performance/client-side-router-cache-mechanism-in-memory-prefetching-invalidation":
    {
      Body: ClientRouterCache,
      headings: clientRouterCacheHeadings,
      cover: {
        src: ch4Topic5Cover,
        alt: {
          bn: "Client-Side Router Cache মেকানিজম (In-Memory Prefetching ও ইনভ্যালিডেশন)",
          en: "Client-Side Router Cache Mechanism (In-Memory Prefetching & Invalidation)",
        },
      },
    },
  "caching-performance/revalidation-strategies-time-based-isr-vs-on-demand-revalidatepath-revalidatetag":
    {
      Body: RevalidationStrategies,
      headings: revalidationStrategiesHeadings,
      cover: {
        src: ch4Topic6Cover,
        alt: {
          bn: "রিভ্যালিডেশন স্ট্র্যাটেজি (Time-based ISR বনাম On-demand revalidatePath ও revalidateTag)",
          en: "Revalidation Strategies (Time-based ISR vs On-demand revalidatePath & revalidateTag)",
        },
      },
    },
  "caching-performance/core-web-vitals-asset-optimization-next-image-next-font-next-script":
    {
      Body: CoreWebVitalsAssets,
      headings: coreWebVitalsAssetsHeadings,
      cover: {
        src: ch4Topic7Cover,
        alt: {
          bn: "Core Web Vitals ও Asset অপটিমাইজেশন (next/image, next/font, next/script)",
          en: "Core Web Vitals & Asset Optimization (next/image, next/font, next/script)",
        },
      },
    },
  "caching-performance/dynamic-imports-code-splitting-next-dynamic-vs-react-lazy-suspense":
    {
      Body: DynamicImportsCodeSplitting,
      headings: dynamicImportsCodeSplittingHeadings,
      cover: {
        src: ch4Topic8Cover,
        alt: {
          bn: "Dynamic Imports ও Code Splitting (next/dynamic বনাম React.lazy / Suspense)",
          en: "Dynamic Imports & Code Splitting (next/dynamic vs React.lazy / Suspense)",
        },
      },
    },
  "caching-performance/bundle-analysis-performance-auditing-next-bundle-analyzer-lighthouse-core-web-vitals":
    {
      Body: BundleAnalysisAuditing,
      headings: bundleAnalysisAuditingHeadings,
      cover: {
        src: ch4Topic9Cover,
        alt: {
          bn: "Bundle Analysis ও পারফরম্যান্স অডিটিং (bundle-analyzer, Lighthouse ও Core Web Vitals)",
          en: "Bundle Analysis & Performance Auditing (@next/bundle-analyzer, Lighthouse & Core Web Vitals)",
        },
      },
    },
  "caching-performance/partial-prerendering-ppr-hybrid-rendering-architecture":
    {
      Body: PartialPrerendering,
      headings: partialPrerenderingHeadings,
      cover: {
        src: ch4Topic10Cover,
        alt: {
          bn: "Partial Prerendering (PPR) ও হাইব্রিড রেন্ডারিং আর্কিটেকচার",
          en: "Partial Prerendering (PPR) & Hybrid Rendering Architecture",
        },
      },
    },

  // ── Chapter 05 — Advanced App Router Architecture ───────────────────
  "routing-architecture/route-groups-folder-layout-isolation": {
    Body: RouteGroups,
    headings: routeGroupsHeadings,
    cover: {
      src: ch5Topic1Cover,
      alt: {
        bn: "Route Groups ও লেআউট আইসোলেশন",
        en: "Route Groups (folder) & Layout Isolation",
      },
    },
  },
  "routing-architecture/dynamic-routes-catch-all-optional-catch-all-segments": {
    Body: DynamicAndCatchAllRoutes,
    headings: dynamicAndCatchAllRoutesHeadings,
    cover: {
      src: ch5Topic2Cover,
      alt: {
        bn: "Dynamic Routes ও Catch-All / Optional Catch-All সেগমেন্ট",
        en: "Dynamic Routes & Catch-All / Optional Catch-All Segments",
      },
    },
  },
  "routing-architecture/parallel-routes-slot-conditional-rendering": {
    Body: ParallelRoutes,
    headings: parallelRoutesHeadings,
    cover: {
      src: ch5Topic3Cover,
      alt: {
        bn: "Parallel Routes (@slot) ও কন্ডিশনাল রেন্ডারিং",
        en: "Parallel Routes (@slot) & Conditional Rendering",
      },
    },
  },
  "routing-architecture/intercepting-routes": {
    Body: InterceptingRoutes,
    headings: interceptingRoutesHeadings,
    cover: {
      src: ch5Topic4Cover,
      alt: {
        bn: "Intercepting Routes — (.), (..) ও (...)",
        en: "Intercepting Routes",
      },
    },
  },
  "routing-architecture/parallel-intercepting-routes-the-photo-modal-pattern": {
    Body: PhotoModalPattern,
    headings: photoModalPatternHeadings,
    cover: {
      src: ch5Topic5Cover,
      alt: {
        bn: "Parallel ও Intercepting একসাথে — Photo Modal প্যাটার্ন",
        en: "Parallel + Intercepting Routes: The Photo Modal Pattern",
      },
    },
  },
  "routing-architecture/nested-layout-architecture-state-preservation": {
    Body: NestedLayoutStatePreservation,
    headings: nestedLayoutStatePreservationHeadings,
    cover: {
      src: ch5Topic6Cover,
      alt: {
        bn: "Nested Layout আর্কিটেকচার ও স্টেট প্রিজার্ভেশন",
        en: "Nested Layout Architecture & State Preservation",
      },
    },
  },
  "routing-architecture/route-level-loading-ui-architecture": {
    Body: RouteLevelLoadingUi,
    headings: routeLevelLoadingUiHeadings,
    cover: {
      src: ch5Topic7Cover,
      alt: {
        bn: "Route-লেভেল Loading UI আর্কিটেকচার",
        en: "Route-level Loading UI Architecture",
      },
    },
  },
  "routing-architecture/route-level-error-ui-architecture": {
    Body: RouteLevelErrorUi,
    headings: routeLevelErrorUiHeadings,
    cover: {
      src: ch5Topic8Cover,
      alt: {
        bn: "Route-লেভেল Error UI আর্কিটেকচার",
        en: "Route-level Error UI Architecture",
      },
    },
  },
  "routing-architecture/route-segment-configuration-rendering-control": {
    Body: RouteSegmentConfiguration,
    headings: routeSegmentConfigurationHeadings,
    cover: {
      src: ch5Topic9Cover,
      alt: {
        bn: "Route Segment কনফিগারেশন ও রেন্ডারিং কন্ট্রোল",
        en: "Route Segment Configuration & Rendering Control",
      },
    },
  },
  "routing-architecture/complex-dashboard-architecture-with-parallel-routes": {
    Body: ComplexDashboardParallelRoutes,
    headings: complexDashboardParallelRoutesHeadings,
    cover: {
      src: ch5Topic10Cover,
      alt: {
        bn: "Parallel Routes দিয়ে কমপ্লেক্স ড্যাশবোর্ড আর্কিটেকচার",
        en: "Complex Dashboard Architecture with Parallel Routes",
      },
    },
  },
};
