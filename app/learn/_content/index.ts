import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";

import rscPayloadMechanicsCover from "@/public/blogs-images/rsc-payload-mechanics-network-overhead.png";
import serverToClientCover from "@/public/blogs-images/server-to-client-boundary-leakage-server-only-enforcement.png";
import hydrationBottlenecksMismatchCover from "@/public/blogs-images/hydration-bottlenecks-mismatch-debugging-ssr-mechanics.png";
import bundleSizeBloatCover from "@/public/blogs-images/bundle-size-bloat-tree-shaking-pitfalls.png";
import imageAssetOptimizationCover from "@/public/blogs-images/image-asset-optimization-mechanics-next-image-internals.png";
import nestedLayoutsVsCover from "@/public/blogs-images/nested-layouts-vs-templates-client-state-retention.png";
import streamingSsrWithCover from "@/public/blogs-images/streaming-ssr-with-suspense-architecture.png";
import parallelInterceptingRoutesCover from "@/public/blogs-images/parallel-intercepting-routes-for-production-modal-architecture.png";
import nextJsFontCover from "@/public/blogs-images/next-js-font-script-optimization-next-font-next-script-strategy.png";
import clientMemoryLeaksCover from "@/public/blogs-images/client-memory-leaks-edge-cases-in-spa-navigation.png";
import type { Bi } from "@/lib/curriculum";
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
import UseServerBoundary, {
  headings as useServerBoundaryHeadings,
} from "./use-server-directives-boundary-closure-trap";
import ServerActionSecurity, {
  headings as serverActionSecurityHeadings,
} from "./server-action-security-vectors-csrf-input-sanitization-unprotected-endpoints";
import ZodUseActionState, {
  headings as zodUseActionStateHeadings,
} from "./form-validation-patterns-using-zod-useactionstate";
import OptimisticUi, {
  headings as optimisticUiHeadings,
} from "./optimistic-ui-updates-with-useoptimistic-fallback-recovery";
import ProgressiveEnhancement, {
  headings as progressiveEnhancementHeadings,
} from "./progressive-enhancement-form-submissions-without-javascript";
import ProgrammaticActions, {
  headings as programmaticActionsHeadings,
} from "./programmatic-action-execution-calling-actions-outside-forms";
import RevalidationDynamics, {
  headings as revalidationDynamicsHeadings,
} from "./cache-invalidation-revalidation-dynamics-revalidatepath-vs-revalidatetag";
import TypedActionResults, {
  headings as typedActionResultsHeadings,
} from "./error-handling-typed-action-results-discriminated-unions-pattern";
import FileUploadStreaming, {
  headings as fileUploadStreamingHeadings,
} from "./file-uploads-stream-handling-via-server-actions";
import ServerActionSecurityPractices, {
  headings as serverActionSecurityPracticesHeadings,
} from "./security-best-practices-in-server-actions-csrf-rate-limiting-auth";

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
  // cover: ছবি পরে যোগ হবে, তাই এখন শুধু body আর headings।
  "data-fetching-architecture/next-js-caching-hierarchy-request-flow": {
    Body: CachingHierarchy,
    headings: cachingHierarchyHeadings,
  },
  "data-fetching-architecture/next-js-16-uncached-by-default-shift-explicit-caching-with-use-cache":
    {
      Body: UncachedByDefault,
      headings: uncachedByDefaultHeadings,
    },
  "data-fetching-architecture/request-memoization-mechanics-deduplication-scope":
    {
      Body: RequestMemoization,
      headings: requestMemoizationHeadings,
    },
  "data-fetching-architecture/time-based-vs-on-demand-revalidation-race-conditions":
    {
      Body: RevalidationRaceConditions,
      headings: revalidationRaceHeadings,
    },
  "data-fetching-architecture/tag-based-cache-invalidation-architecture-revalidatetag-cachetag":
    {
      Body: TagBasedInvalidation,
      headings: tagBasedInvalidationHeadings,
    },
  "data-fetching-architecture/dynamic-functions-escalation-cache-opt-out-bottlenecks":
    {
      Body: DynamicEscalation,
      headings: dynamicEscalationHeadings,
    },
  "data-fetching-architecture/stale-while-revalidate-behavior-at-the-node-edge-server-layer":
    {
      Body: SwrBehavior,
      headings: swrBehaviorHeadings,
    },
  "data-fetching-architecture/router-cache-invalidation-client-side-navigation-stale-data":
    {
      Body: RouterCacheStaleness,
      headings: routerCacheStalenessHeadings,
    },
  "data-fetching-architecture/server-component-parallel-data-fetching-promise-all-bottlenecks":
    {
      Body: ParallelDataFetching,
      headings: parallelDataFetchingHeadings,
    },
  "data-fetching-architecture/data-security-authorization-leak-in-cached-data-cache-poisoning":
    {
      Body: CachePoisoning,
      headings: cachePoisoningHeadings,
    },

  // ── Chapter 03 — Server Actions ──────────────────────────────────────
  "server-actions/use-server-directives-boundary-closure-trap": {
    Body: UseServerBoundary,
    headings: useServerBoundaryHeadings,
  },
  "server-actions/server-action-security-vectors-csrf-input-sanitization-unprotected-endpoints":
    {
      Body: ServerActionSecurity,
      headings: serverActionSecurityHeadings,
    },
  "server-actions/form-validation-patterns-using-zod-useactionstate": {
    Body: ZodUseActionState,
    headings: zodUseActionStateHeadings,
  },
  "server-actions/optimistic-ui-updates-with-useoptimistic-fallback-recovery": {
    Body: OptimisticUi,
    headings: optimisticUiHeadings,
  },
  "server-actions/progressive-enhancement-form-submissions-without-javascript":
    {
      Body: ProgressiveEnhancement,
      headings: progressiveEnhancementHeadings,
    },
  "server-actions/programmatic-action-execution-calling-actions-outside-forms": {
    Body: ProgrammaticActions,
    headings: programmaticActionsHeadings,
  },
  "server-actions/cache-invalidation-revalidation-dynamics-revalidatepath-vs-revalidatetag":
    {
      Body: RevalidationDynamics,
      headings: revalidationDynamicsHeadings,
    },
  "server-actions/error-handling-typed-action-results-discriminated-unions-pattern":
    {
      Body: TypedActionResults,
      headings: typedActionResultsHeadings,
    },
  "server-actions/file-uploads-stream-handling-via-server-actions": {
    Body: FileUploadStreaming,
    headings: fileUploadStreamingHeadings,
  },
  "server-actions/security-best-practices-in-server-actions-csrf-rate-limiting-auth":
    {
      Body: ServerActionSecurityPractices,
      headings: serverActionSecurityPracticesHeadings,
    },
};
