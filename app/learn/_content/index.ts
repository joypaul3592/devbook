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
import ch6Topic1Cover from "@/public/blogs-images/chapter-6/topic-1.png";
import ch6Topic2Cover from "@/public/blogs-images/chapter-6/topic-2.png";
import ch6Topic3Cover from "@/public/blogs-images/chapter-6/topic-3.png";
import ch6Topic4Cover from "@/public/blogs-images/chapter-6/topic-4.png";
import ch6Topic5Cover from "@/public/blogs-images/chapter-6/topic-5.png";
import ch6Topic6Cover from "@/public/blogs-images/chapter-6/topic-6.png";
import ch6Topic7Cover from "@/public/blogs-images/chapter-6/topic-7.png";
import ch6Topic8Cover from "@/public/blogs-images/chapter-6/topic-8.png";
import ch6Topic9Cover from "@/public/blogs-images/chapter-6/topic-9.png";
import ch6Topic10Cover from "@/public/blogs-images/chapter-6/topic-10.png";
import ch7Topic1Cover from "@/public/blogs-images/chapter-7/topic-1.png";
import ch7Topic2Cover from "@/public/blogs-images/chapter-7/topic-2.png";
import ch7Topic3Cover from "@/public/blogs-images/chapter-7/topic-3.png";
import ch7Topic4Cover from "@/public/blogs-images/chapter-7/topic-4.png";
import ch7Topic5Cover from "@/public/blogs-images/chapter-7/topic-5.png";
import ch7Topic6Cover from "@/public/blogs-images/chapter-7/topic-6.png";
import ch7Topic7Cover from "@/public/blogs-images/chapter-7/topic-7.png";
import ch7Topic8Cover from "@/public/blogs-images/chapter-7/topic-8.png";
import ch7Topic9Cover from "@/public/blogs-images/chapter-7/topic-9.png";
import ch7Topic10Cover from "@/public/blogs-images/chapter-7/topic-10.png";
import ch8Topic1Cover from "@/public/blogs-images/chapter-8/topic-1.png";
import ch8Topic2Cover from "@/public/blogs-images/chapter-8/topic-2.png";
import ch8Topic3Cover from "@/public/blogs-images/chapter-8/topic-3.png";
import ch8Topic4Cover from "@/public/blogs-images/chapter-8/topic-4.png";
import ch8Topic5Cover from "@/public/blogs-images/chapter-8/topic-5.png";
import ch8Topic6Cover from "@/public/blogs-images/chapter-8/topic-6.png";
import ch8Topic7Cover from "@/public/blogs-images/chapter-8/topic-7.png";
import ch8Topic8Cover from "@/public/blogs-images/chapter-8/topic-8.png";
import ch8Topic9Cover from "@/public/blogs-images/chapter-8/topic-9.png";
import ch8Topic10Cover from "@/public/blogs-images/chapter-8/topic-10.png";
import ch9Topic1Cover from "@/public/blogs-images/chapter-9/topic-1.png";
import ch9Topic2Cover from "@/public/blogs-images/chapter-9/topic-2.png";
import ch9Topic3Cover from "@/public/blogs-images/chapter-9/topic-3.png";
import ch9Topic4Cover from "@/public/blogs-images/chapter-9/topic-4.png";
import ch9Topic5Cover from "@/public/blogs-images/chapter-9/topic-5.png";
import ch9Topic6Cover from "@/public/blogs-images/chapter-9/topic-6.png";
import ch9Topic7Cover from "@/public/blogs-images/chapter-9/topic-7.png";
import ch9Topic8Cover from "@/public/blogs-images/chapter-9/topic-8.png";
import ch9Topic9Cover from "@/public/blogs-images/chapter-9/topic-9.png";
import ch9Topic10Cover from "@/public/blogs-images/chapter-9/topic-10.png";
import ch10Topic1Cover from "@/public/blogs-images/chapter-10/topic-1.png";
import ch10Topic2Cover from "@/public/blogs-images/chapter-10/topic-2.png";
import ch10Topic3Cover from "@/public/blogs-images/chapter-10/topic-3.png";
import ch10Topic4Cover from "@/public/blogs-images/chapter-10/topic-4.png";
import ch10Topic5Cover from "@/public/blogs-images/chapter-10/topic-5.png";
import ch10Topic6Cover from "@/public/blogs-images/chapter-10/topic-6.png";
import ch10Topic7Cover from "@/public/blogs-images/chapter-10/topic-7.png";
import ch10Topic8Cover from "@/public/blogs-images/chapter-10/topic-8.png";
import ch10Topic9Cover from "@/public/blogs-images/chapter-10/topic-9.png";
import ch10Topic10Cover from "@/public/blogs-images/chapter-10/topic-10.png";
import ch11Topic1Cover from "@/public/blogs-images/chapter-11/topic-1.png";
import ch11Topic2Cover from "@/public/blogs-images/chapter-11/topic-2.png";
import ch11Topic3Cover from "@/public/blogs-images/chapter-11/topic-3.png";
import ch11Topic4Cover from "@/public/blogs-images/chapter-11/topic-4.png";
import ch11Topic5Cover from "@/public/blogs-images/chapter-11/topic-5.png";
import ch11Topic6Cover from "@/public/blogs-images/chapter-11/topic-6.png";
import ch11Topic7Cover from "@/public/blogs-images/chapter-11/topic-7.png";
import ch11Topic8Cover from "@/public/blogs-images/chapter-11/topic-8.png";
import ch11Topic9Cover from "@/public/blogs-images/chapter-11/topic-9.png";
import ch11Topic10Cover from "@/public/blogs-images/chapter-11/topic-10.png";
import ch12Topic1Cover from "@/public/blogs-images/chapter-12/topic-1.png";
import ch12Topic2Cover from "@/public/blogs-images/chapter-12/topic-2.png";
import ch12Topic3Cover from "@/public/blogs-images/chapter-12/topic-3.png";
import ch12Topic4Cover from "@/public/blogs-images/chapter-12/topic-4.png";
import ch12Topic5Cover from "@/public/blogs-images/chapter-12/topic-5.png";
import ch12Topic6Cover from "@/public/blogs-images/chapter-12/topic-6.png";
import ch12Topic7Cover from "@/public/blogs-images/chapter-12/topic-7.png";
import ch12Topic8Cover from "@/public/blogs-images/chapter-12/topic-8.png";
import ch12Topic9Cover from "@/public/blogs-images/chapter-12/topic-9.png";
import ch12Topic10Cover from "@/public/blogs-images/chapter-12/topic-10.png";
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
import ClientNavigationLifecycle, {
  headings as clientNavigationLifecycleHeadings,
} from "./next-js-client-navigation-lifecycle";
import LinkPrefetchingMechanics, {
  headings as linkPrefetchingMechanicsHeadings,
} from "./link-prefetching-mechanics";
import NavigationPrefetchingStrategy, {
  headings as navigationPrefetchingStrategyHeadings,
} from "./navigation-prefetching-strategy";
import UseRouterVsLink, {
  headings as useRouterVsLinkHeadings,
} from "./userouter-vs-link";
import UrlStateArchitecture, {
  headings as urlStateArchitectureHeadings,
} from "./url-state-architecture";
import PaginationStateUrlSync, {
  headings as paginationStateUrlSyncHeadings,
} from "./pagination-state-url-synchronization";
import ScrollRestoration, {
  headings as scrollRestorationHeadings,
} from "./scroll-restoration";
import SearchFilterStateInTheUrl, {
  headings as searchFilterStateInTheUrlHeadings,
} from "./search-filter-state-in-the-url";
import ServerSideNavigationControl, {
  headings as serverSideNavigationControlHeadings,
} from "./server-side-navigation-control-redirect-vs-permanentredirect";
import ClientRouterCacheMechanics, {
  headings as clientRouterCacheMechanicsHeadings,
} from "./client-router-cache-mechanics-router-refresh";
import StaticRenderingArchitecture, {
  headings as staticRenderingArchitectureHeadings,
} from "./static-rendering-architecture";
import DynamicRenderingArchitecture, {
  headings as dynamicRenderingArchitectureHeadings,
} from "./dynamic-rendering-architecture";
import StreamingRendering, {
  headings as streamingRenderingHeadings,
} from "./streaming-rendering";
import ServerSideRenderingLifecycle, {
  headings as serverSideRenderingLifecycleHeadings,
} from "./server-side-rendering-lifecycle";
import ClientSideRenderingTradeOffs, {
  headings as clientSideRenderingTradeOffsHeadings,
} from "./client-side-rendering-trade-offs";
import HybridRenderingArchitecture, {
  headings as hybridRenderingArchitectureHeadings,
} from "./hybrid-rendering-architecture";
import RenderingBoundaries, {
  headings as renderingBoundariesHeadings,
} from "./rendering-boundaries";
import HiddenCostsOfDynamicRendering, {
  headings as hiddenCostsOfDynamicRenderingHeadings,
} from "./hidden-costs-of-dynamic-rendering";
import ServerComponentSecurityDataLeaks, {
  headings as serverComponentSecurityDataLeaksHeadings,
} from "./server-component-security-data-leaks";
import PerformanceAuditingCoreWebVitals, {
  headings as performanceAuditingCoreWebVitalsHeadings,
} from "./performance-auditing-core-web-vitals";
import ReactSuspenseMentalModel, {
  headings as reactSuspenseMentalModelHeadings,
} from "./react-suspense-mental-model";
import SuspenseBoundaryArchitecture, {
  headings as suspenseBoundaryArchitectureHeadings,
} from "./suspense-boundary-architecture";
import StreamingHtml, {
  headings as streamingHtmlHeadings,
} from "./streaming-html";
import ProgressiveRendering, {
  headings as progressiveRenderingHeadings,
} from "./progressive-rendering";
import NestedSuspenseBoundaries, {
  headings as nestedSuspenseBoundariesHeadings,
} from "./nested-suspense-boundaries";
import LoadingUiVsSuspense, {
  headings as loadingUiVsSuspenseHeadings,
} from "./loading-ui-vs-suspense";
import SuspenseWaterfallProblems, {
  headings as suspenseWaterfallProblemsHeadings,
} from "./suspense-waterfall-problems";
import ParallelRenderingWithSuspense, {
  headings as parallelRenderingWithSuspenseHeadings,
} from "./parallel-rendering-with-suspense";
import UxDesignForStreaming, {
  headings as uxDesignForStreamingHeadings,
} from "./ux-design-for-streaming";
import DebuggingStreamingPerformance, {
  headings as debuggingStreamingPerformanceHeadings,
} from "./debugging-streaming-performance";
import ReactServerComponents, {
  headings as reactServerComponentsHeadings,
} from "./react-server-components";
import SuspenseAndStreaming, {
  headings as suspenseAndStreamingHeadings,
} from "./suspense-streaming";
import ConcurrentRendering, {
  headings as concurrentRenderingHeadings,
} from "./concurrent-rendering";
import TransitionsAndUseTransition, {
  headings as transitionsAndUseTransitionHeadings,
} from "./transitions-usetransition";
import UseOptimisticHook, {
  headings as useOptimisticHookHeadings,
} from "./useoptimistic";
import UseActionStateHook, {
  headings as useActionStateHookHeadings,
} from "./useactionstate";
import ReactCompiler, {
  headings as reactCompilerHeadings,
} from "./react-compiler";
import Hydration, { headings as hydrationTopicHeadings } from "./hydration";
import StateArchitecture, {
  headings as stateArchitectureHeadings,
} from "./state-architecture";
import ContextPerformance, {
  headings as contextPerformanceHeadings,
} from "./context-performance";
import ReRenderRootCauseAnalysis, {
  headings as reRenderRootCauseAnalysisHeadings,
} from "./re-render-root-cause-analysis";
import ComponentGranularityRenderCost, {
  headings as componentGranularityRenderCostHeadings,
} from "./component-granularity-render-cost";
import WhenToUseMemo, {
  headings as whenToUseMemoHeadings,
} from "./when-to-use-memo";
import UseMemoCostVsBenefit, {
  headings as useMemoCostVsBenefitHeadings,
} from "./usememo-cost-vs-benefit";
import UseCallbackCostVsBenefit, {
  headings as useCallbackCostVsBenefitHeadings,
} from "./usecallback-cost-vs-benefit";
import StateColocationContextSplitting, {
  headings as stateColocationContextSplittingHeadings,
} from "./state-colocation-context-splitting";
import ComponentGranularityAndStructure, {
  headings as componentGranularityAndStructureHeadings,
} from "./component-granularity-and-structure";
import KeyPropAsComponentIdentity, {
  headings as keyPropAsComponentIdentityHeadings,
} from "./key-prop-as-component-identity";
import ReactCompilerAutoMemoization, {
  headings as reactCompilerAutoMemoizationHeadings,
} from "./react-compiler-auto-memoization";
import PerformanceBudgetMonitoring, {
  headings as performanceBudgetMonitoringHeadings,
} from "./performance-budget-monitoring";
import TreeShakingDeadCodeElimination, {
  headings as treeShakingDeadCodeEliminationHeadings,
} from "./tree-shaking-dead-code-elimination";
import EsmVsCjs, { headings as esmVsCjsHeadings } from "./esm-vs-cjs";
import BundleSplittingChunking, {
  headings as bundleSplittingChunkingHeadings,
} from "./bundle-splitting-chunking";
import DynamicImports, {
  headings as dynamicImportsHeadings,
} from "./dynamic-imports";
import PackageOptimization, {
  headings as packageOptimizationHeadings,
} from "./package-optimization-optimizepackageimports-modularizeimports";
import PackageJsonOptimization, {
  headings as packageJsonOptimizationHeadings,
} from "./package-json-optimization";
import DependencyAnalysis, {
  headings as dependencyAnalysisHeadings,
} from "./dependency-analysis";
import BundleAnalyzer, {
  headings as bundleAnalyzerHeadings,
} from "./bundle-analyzer";
import DynamicImportsReactLazySsr, {
  headings as dynamicImportsReactLazySsrHeadings,
} from "./dynamic-imports-react-lazy-ssr-options";
import DuplicateDependencies, {
  headings as duplicateDependenciesHeadings,
} from "./duplicate-dependencies";
import RouteLevelCodeSplitting, {
  headings as routeLevelCodeSplittingHeadings,
} from "./route-level-code-splitting";
import ComponentLevelCodeSplitting, {
  headings as componentLevelCodeSplittingHeadings,
} from "./component-level-code-splitting";
import NextDynamic, { headings as nextDynamicHeadings } from "./next-dynamic";
import LazyLoadingStrategy, {
  headings as lazyLoadingStrategyHeadings,
} from "./lazy-loading-strategy";
import HeavyThirdPartyLibraryIsolation, {
  headings as heavyThirdPartyLibraryIsolationHeadings,
} from "./heavy-third-party-library-isolation";
import ClientOnlyPackageLoading, {
  headings as clientOnlyPackageLoadingHeadings,
} from "./client-only-package-loading";
import AboveTheFoldVsBelowTheFoldLoading, {
  headings as aboveTheFoldVsBelowTheFoldLoadingHeadings,
} from "./above-the-fold-vs-below-the-fold-loading";
import RoutePreFetchingOptimization, {
  headings as routePreFetchingOptimizationHeadings,
} from "./route-pre-fetching-optimization";
import ImageFontOptimization, {
  headings as imageFontOptimizationHeadings,
} from "./image-font-optimization";
import ChunkDuplicationProductionBundleBudget, {
  headings as chunkDuplicationProductionBundleBudgetHeadings,
} from "./chunk-duplication-production-bundle-budget";

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

  // ── Chapter 06 — Advanced Navigation & URL Architecture ─────────────
  "navigation-url-architecture/next-js-client-navigation-lifecycle": {
    Body: ClientNavigationLifecycle,
    headings: clientNavigationLifecycleHeadings,
    cover: {
      src: ch6Topic1Cover,
      alt: {
        bn: "Next.js ক্লায়েন্ট নেভিগেশন লাইফসাইকেল",
        en: "Next.js Client Navigation Lifecycle",
      },
    },
  },
  "navigation-url-architecture/link-prefetching-mechanics": {
    Body: LinkPrefetchingMechanics,
    headings: linkPrefetchingMechanicsHeadings,
    cover: {
      src: ch6Topic2Cover,
      alt: {
        bn: "<Link> Prefetching মেকানিক্স",
        en: "<Link> Prefetching Mechanics",
      },
    },
  },
  "navigation-url-architecture/navigation-prefetching-strategy": {
    Body: NavigationPrefetchingStrategy,
    headings: navigationPrefetchingStrategyHeadings,
    cover: {
      src: ch6Topic3Cover,
      alt: {
        bn: "নেভিগেশন Prefetching স্ট্র্যাটেজি",
        en: "Navigation Prefetching Strategy",
      },
    },
  },
  "navigation-url-architecture/userouter-vs-link": {
    Body: UseRouterVsLink,
    headings: useRouterVsLinkHeadings,
    cover: {
      src: ch6Topic4Cover,
      alt: {
        bn: "useRouter() বনাম <Link>",
        en: "useRouter() vs <Link>",
      },
    },
  },
  "navigation-url-architecture/url-state-architecture": {
    Body: UrlStateArchitecture,
    headings: urlStateArchitectureHeadings,
    cover: {
      src: ch6Topic5Cover,
      alt: {
        bn: "URL স্টেট আর্কিটেকচার — URL-ই Single Source of Truth",
        en: "URL State Architecture — URL as Single Source of Truth",
      },
    },
  },
  "navigation-url-architecture/search-filter-state-in-the-url": {
    Body: SearchFilterStateInTheUrl,
    headings: searchFilterStateInTheUrlHeadings,
    cover: {
      src: ch6Topic6Cover,
      alt: {
        bn: "URL-এ Search ও Filter স্টেট (nuqs, debouncing ও সার্ভার সিঙ্ক)",
        en: "Search & Filter State in the URL (nuqs, debouncing & server sync)",
      },
    },
  },
  "navigation-url-architecture/pagination-state-url-synchronization": {
    Body: PaginationStateUrlSync,
    headings: paginationStateUrlSyncHeadings,
    cover: {
      src: ch6Topic7Cover,
      alt: {
        bn: "Pagination স্টেট ও URL সিঙ্ক্রোনাইজেশন",
        en: "Pagination State & URL Synchronization",
      },
    },
  },
  "navigation-url-architecture/scroll-restoration": {
    Body: ScrollRestoration,
    headings: scrollRestorationHeadings,
    cover: {
      src: ch6Topic8Cover,
      alt: {
        bn: "Scroll Restoration ও কাস্টম স্ক্রল বিহেভিয়ার",
        en: "Scroll Restoration & Custom Scroll Behaviour",
      },
    },
  },
  "navigation-url-architecture/server-side-navigation-control-redirect-vs-permanentredirect":
    {
      Body: ServerSideNavigationControl,
      headings: serverSideNavigationControlHeadings,
      cover: {
        src: ch6Topic9Cover,
        alt: {
          bn: "Server-side নেভিগেশন কন্ট্রোল — redirect বনাম permanentRedirect",
          en: "Server-side Navigation Control — redirect vs permanentRedirect",
        },
      },
    },
  "navigation-url-architecture/client-router-cache-mechanics-router-refresh": {
    Body: ClientRouterCacheMechanics,
    headings: clientRouterCacheMechanicsHeadings,
    cover: {
      src: ch6Topic10Cover,
      alt: {
        bn: "Client Router Cache মেকানিক্স ও router.refresh()",
        en: "Client Router Cache Mechanics & router.refresh()",
      },
    },
  },

  // ── Chapter 07 — Rendering Strategies ───────────────────────────────
  "rendering-strategies/static-rendering-architecture": {
    Body: StaticRenderingArchitecture,
    headings: staticRenderingArchitectureHeadings,
    cover: {
      src: ch7Topic1Cover,
      alt: {
        bn: "Static রেন্ডারিং আর্কিটেকচার",
        en: "Static Rendering Architecture",
      },
    },
  },
  "rendering-strategies/dynamic-rendering-architecture": {
    Body: DynamicRenderingArchitecture,
    headings: dynamicRenderingArchitectureHeadings,
    cover: {
      src: ch7Topic2Cover,
      alt: {
        bn: "Dynamic রেন্ডারিং আর্কিটেকচার",
        en: "Dynamic Rendering Architecture",
      },
    },
  },
  "rendering-strategies/streaming-rendering": {
    Body: StreamingRendering,
    headings: streamingRenderingHeadings,
    cover: {
      src: ch7Topic3Cover,
      alt: {
        bn: "Streaming রেন্ডারিং",
        en: "Streaming Rendering",
      },
    },
  },
  "rendering-strategies/server-side-rendering-lifecycle": {
    Body: ServerSideRenderingLifecycle,
    headings: serverSideRenderingLifecycleHeadings,
    cover: {
      src: ch7Topic4Cover,
      alt: {
        bn: "Server-side রেন্ডারিং লাইফসাইকেল — RSC Payload, Hydration ও Client Takeover",
        en: "Server-side Rendering Lifecycle — RSC Payload, Hydration & Client Takeover",
      },
    },
  },
  "rendering-strategies/client-side-rendering-trade-offs": {
    Body: ClientSideRenderingTradeOffs,
    headings: clientSideRenderingTradeOffsHeadings,
    cover: {
      src: ch7Topic5Cover,
      alt: {
        bn: "Client-side রেন্ডারিং ট্রেড-অফ — বান্ডল সাইজ, SEO ও পারফরম্যান্স",
        en: "Client-side Rendering Trade-offs — Bundle Size, SEO & Performance",
      },
    },
  },
  "rendering-strategies/hybrid-rendering-architecture": {
    Body: HybridRenderingArchitecture,
    headings: hybridRenderingArchitectureHeadings,
    cover: {
      src: ch7Topic6Cover,
      alt: {
        bn: "হাইব্রিড রেন্ডারিং আর্কিটেকচার — এক রুটে Static, Dynamic ও Streaming",
        en: "Hybrid Rendering Architecture — Static, Dynamic & Streaming in One Route",
      },
    },
  },
  "rendering-strategies/rendering-boundaries": {
    Body: RenderingBoundaries,
    headings: renderingBoundariesHeadings,
    cover: {
      src: ch7Topic7Cover,
      alt: {
        bn: "রেন্ডারিং বাউন্ডারি ও children প্রপ প্যাটার্ন",
        en: "Rendering Boundaries & the children Prop Pattern",
      },
    },
  },
  "rendering-strategies/hidden-costs-of-dynamic-rendering": {
    Body: HiddenCostsOfDynamicRendering,
    headings: hiddenCostsOfDynamicRenderingHeadings,
    cover: {
      src: ch7Topic8Cover,
      alt: {
        bn: "Dynamic রেন্ডারিং-এর লুকানো খরচ — Compute, Serverless Limit ও DB Pooling",
        en: "Hidden Costs of Dynamic Rendering — Compute, Serverless Limits & DB Pooling",
      },
    },
  },
  "rendering-strategies/server-component-security-data-leaks": {
    Body: ServerComponentSecurityDataLeaks,
    headings: serverComponentSecurityDataLeaksHeadings,
    cover: {
      src: ch7Topic9Cover,
      alt: {
        bn: "Server Component সিকিউরিটি ও ডেটা লিক — server-only ও DTO প্যাটার্ন",
        en: "Server Component Security & Data Leaks — server-only & the DTO Pattern",
      },
    },
  },
  "rendering-strategies/performance-auditing-core-web-vitals": {
    Body: PerformanceAuditingCoreWebVitals,
    headings: performanceAuditingCoreWebVitalsHeadings,
    cover: {
      src: ch7Topic10Cover,
      alt: {
        bn: "পারফরম্যান্স অডিটিং ও Core Web Vitals — LCP, CLS ও INP",
        en: "Performance Auditing & Core Web Vitals — LCP, CLS & INP",
      },
    },
  },

  // ── Chapter 08 — Suspense, Streaming & Progressive UI ────────────────
  "suspense-streaming/react-suspense-mental-model": {
    Body: ReactSuspenseMentalModel,
    headings: reactSuspenseMentalModelHeadings,
    cover: {
      src: ch8Topic1Cover,
      alt: {
        bn: "React Suspense মেন্টাল মডেল — Promise Suspension ও Fallback মেকানিক্স",
        en: "React Suspense Mental Model — Promise Suspension & Fallback Mechanics",
      },
    },
  },
  "suspense-streaming/suspense-boundary-architecture": {
    Body: SuspenseBoundaryArchitecture,
    headings: suspenseBoundaryArchitectureHeadings,
    cover: {
      src: ch8Topic2Cover,
      alt: {
        bn: "Suspense বাউন্ডারি আর্কিটেকচার — Granular বনাম Page-level",
        en: "Suspense Boundary Architecture — Granular vs Page-level",
      },
    },
  },
  "suspense-streaming/streaming-html": {
    Body: StreamingHtml,
    headings: streamingHtmlHeadings,
    cover: {
      src: ch8Topic3Cover,
      alt: {
        bn: "Streaming HTML — HTTP Chunking ও Out-of-Order Injection",
        en: "Streaming HTML — HTTP Chunking & Out-of-Order Injection",
      },
    },
  },
  "suspense-streaming/progressive-rendering": {
    Body: ProgressiveRendering,
    headings: progressiveRenderingHeadings,
    cover: {
      src: ch8Topic4Cover,
      alt: {
        bn: "প্রোগ্রেসিভ রেন্ডারিং ও Selective Hydration",
        en: "Progressive Rendering & Selective Hydration",
      },
    },
  },
  "suspense-streaming/nested-suspense-boundaries": {
    Body: NestedSuspenseBoundaries,
    headings: nestedSuspenseBoundariesHeadings,
    cover: {
      src: ch8Topic5Cover,
      alt: {
        bn: "Nested Suspense বাউন্ডারি ও Fallback Resolution",
        en: "Nested Suspense Boundaries & Fallback Resolution",
      },
    },
  },
  "suspense-streaming/loading-ui-vs-suspense": {
    Body: LoadingUiVsSuspense,
    headings: loadingUiVsSuspenseHeadings,
    cover: {
      src: ch8Topic6Cover,
      alt: {
        bn: "loading.js কনভেনশন বনাম Inline Suspense বাউন্ডারি",
        en: "loading.js Convention vs Inline Suspense Boundaries",
      },
    },
  },
  "suspense-streaming/suspense-waterfall-problems": {
    Body: SuspenseWaterfallProblems,
    headings: suspenseWaterfallProblemsHeadings,
    cover: {
      src: ch8Topic7Cover,
      alt: {
        bn: "Suspense Waterfall সমস্যা ও Cascading Stream Delay",
        en: "Suspense Waterfall Problems & Cascading Stream Delays",
      },
    },
  },
  "suspense-streaming/parallel-rendering-with-suspense": {
    Body: ParallelRenderingWithSuspense,
    headings: parallelRenderingWithSuspenseHeadings,
    cover: {
      src: ch8Topic8Cover,
      alt: {
        bn: "Suspense দিয়ে Parallel রেন্ডারিং — Data-level বনাম Component-level",
        en: "Parallel Rendering with Suspense — Data-level vs Component-level",
      },
    },
  },
  "suspense-streaming/ux-design-for-streaming": {
    Body: UxDesignForStreaming,
    headings: uxDesignForStreamingHeadings,
    cover: {
      src: ch8Topic9Cover,
      alt: {
        bn: "Streaming-এর UX ডিজাইন — Layout Shift ও Skeleton Matching",
        en: "UX Design for Streaming — Layout Shift & Skeleton Matching",
      },
    },
  },
  "suspense-streaming/debugging-streaming-performance": {
    Body: DebuggingStreamingPerformance,
    headings: debuggingStreamingPerformanceHeadings,
    cover: {
      src: ch8Topic10Cover,
      alt: {
        bn: "Streaming পারফরম্যান্স ডিবাগিং ও Hydration ডায়াগনস্টিকস",
        en: "Debugging Streaming Performance & Hydration Diagnostics",
      },
    },
  },

  // ── Chapter 09 — Advanced React for Next.js ──────────────────────────
  "advanced-react/react-server-components": {
    Body: ReactServerComponents,
    headings: reactServerComponentsHeadings,
    cover: {
      src: ch9Topic1Cover,
      alt: {
        bn: "React Server Components — আর্কিটেকচার, Flight Protocol ও মেন্টাল মডেল",
        en: "React Server Components — Architecture, Flight Protocol & Mental Model",
      },
    },
  },
  "advanced-react/suspense-streaming": {
    Body: SuspenseAndStreaming,
    headings: suspenseAndStreamingHeadings,
    cover: {
      src: ch9Topic2Cover,
      alt: {
        bn: "Suspense ও Streaming — Granular বাউন্ডারি ও Out-of-Order স্ট্রিমিং",
        en: "Suspense & Streaming — Granular Boundaries & Out-of-Order Streaming",
      },
    },
  },
  "advanced-react/concurrent-rendering": {
    Body: ConcurrentRendering,
    headings: concurrentRenderingHeadings,
    cover: {
      src: ch9Topic3Cover,
      alt: {
        bn: "কনকারেন্ট রেন্ডারিং — Interruptible রেন্ডারিং ও Lane Model",
        en: "Concurrent Rendering — Interruptible Rendering & the Lane Model",
      },
    },
  },
  "advanced-react/transitions-usetransition": {
    Body: TransitionsAndUseTransition,
    headings: transitionsAndUseTransitionHeadings,
    cover: {
      src: ch9Topic4Cover,
      alt: {
        bn: "ট্রানজিশন ও useTransition — Async Transition ও Pending স্টেট",
        en: "Transitions & useTransition — Async Transitions & Pending State",
      },
    },
  },
  "advanced-react/useoptimistic": {
    Body: UseOptimisticHook,
    headings: useOptimisticHookHeadings,
    cover: {
      src: ch9Topic5Cover,
      alt: {
        bn: "useOptimistic — Optimistic UI আপডেট ও Auto-Rollback আর্কিটেকচার",
        en: "useOptimistic — Optimistic UI Updates & Rollback Architecture",
      },
    },
  },
  "advanced-react/useactionstate": {
    Body: UseActionStateHook,
    headings: useActionStateHookHeadings,
    cover: {
      src: ch9Topic6Cover,
      alt: {
        bn: "useActionState — Action State, Pending স্ট্যাটাস ও ফর্ম লাইফসাইকেল",
        en: "useActionState — Action State, Pending Status & Form Lifecycle",
      },
    },
  },
  "advanced-react/react-compiler": {
    Body: ReactCompiler,
    headings: reactCompilerHeadings,
    cover: {
      src: ch9Topic7Cover,
      alt: {
        bn: "রিঅ্যাক্ট কম্পাইলার — বিল্ড-টাইম Auto-Memoization",
        en: "React Compiler — Build-time Auto-Memoization",
      },
    },
  },
  "advanced-react/hydration": {
    Body: Hydration,
    headings: hydrationTopicHeadings,
    cover: {
      src: ch9Topic8Cover,
      alt: {
        bn: "হাইড্রেশন — SSR Mismatch ও Selective Hydration",
        en: "Hydration — SSR Mismatch & Selective Hydration",
      },
    },
  },
  "advanced-react/state-architecture": {
    Body: StateArchitecture,
    headings: stateArchitectureHeadings,
    cover: {
      src: ch9Topic9Cover,
      alt: {
        bn: "স্টেট আর্কিটেকচার — Co-location, Derived State ও Server/Client সেপারেশন",
        en: "State Architecture — Co-location, Derived State & Server/Client Separation",
      },
    },
  },
  "advanced-react/context-performance": {
    Body: ContextPerformance,
    headings: contextPerformanceHeadings,
    cover: {
      src: ch9Topic10Cover,
      alt: {
        bn: "Context পারফরম্যান্স — Context Splitting, Memoization ও Bail-out",
        en: "Context Performance — Splitting, Memoization & Bail-out",
      },
    },
  },

  // ── Chapter 10 — React Rendering & State Performance ─────────────────
  "react-rendering-performance/re-render-root-cause-analysis": {
    Body: ReRenderRootCauseAnalysis,
    headings: reRenderRootCauseAnalysisHeadings,
    cover: {
      src: ch10Topic1Cover,
      alt: {
        bn: "Re-render-এর রুট কজ অ্যানালাইসিস — ট্রিগার ট্রি ও ডায়াগনস্টিকস",
        en: "Re-render Root Cause Analysis — Trigger Tree & Diagnostics",
      },
    },
  },
  "react-rendering-performance/component-granularity-render-cost": {
    Body: ComponentGranularityRenderCost,
    headings: componentGranularityRenderCostHeadings,
    cover: {
      src: ch10Topic2Cover,
      alt: {
        bn: "কম্পোনেন্ট গ্র্যানুলারিটি ও রেন্ডার কস্ট — Reconciliation ও আইসোলেশন",
        en: "Component Granularity & Render Cost — Reconciliation & Isolation",
      },
    },
  },
  "react-rendering-performance/when-to-use-memo": {
    Body: WhenToUseMemo,
    headings: whenToUseMemoHeadings,
    cover: {
      src: ch10Topic3Cover,
      alt: {
        bn: "memo কখন ব্যবহার করা উচিত — Shallow Comparison ও Bail-out",
        en: "When to Use memo — Shallow Comparison & Bail-out",
      },
    },
  },
  "react-rendering-performance/usememo-cost-vs-benefit": {
    Body: UseMemoCostVsBenefit,
    headings: useMemoCostVsBenefitHeadings,
    cover: {
      src: ch10Topic4Cover,
      alt: {
        bn: "useMemo — খরচ বনাম লাভ ও Referential Stability",
        en: "useMemo Cost vs Benefit & Referential Stability",
      },
    },
  },
  "react-rendering-performance/usecallback-cost-vs-benefit": {
    Body: UseCallbackCostVsBenefit,
    headings: useCallbackCostVsBenefitHeadings,
    cover: {
      src: ch10Topic5Cover,
      alt: {
        bn: "useCallback — খরচ বনাম লাভ, Stale Closure ও Functional Updates",
        en: "useCallback Cost vs Benefit — Stale Closures & Functional Updates",
      },
    },
  },
  "react-rendering-performance/state-colocation-context-splitting": {
    Body: StateColocationContextSplitting,
    headings: stateColocationContextSplittingHeadings,
    cover: {
      src: ch10Topic6Cover,
      alt: {
        bn: "State Colocation ও Context Splitting — Re-render Cascade বন্ধ করা",
        en: "State Colocation & Context Splitting — Stopping the Re-render Cascade",
      },
    },
  },
  "react-rendering-performance/component-granularity-and-structure": {
    Body: ComponentGranularityAndStructure,
    headings: componentGranularityAndStructureHeadings,
    cover: {
      src: ch10Topic7Cover,
      alt: {
        bn: "কম্পোনেন্ট গ্র্যানুলারিটি ও স্ট্রাকচার — State Isolation ও children প্যাটার্ন",
        en: "Component Granularity and Structure — State Isolation & the children Pattern",
      },
    },
  },
  "react-rendering-performance/key-prop-as-component-identity": {
    Body: KeyPropAsComponentIdentity,
    headings: keyPropAsComponentIdentityHeadings,
    cover: {
      src: ch10Topic8Cover,
      alt: {
        bn: "key প্রপ ও কম্পোনেন্ট আইডেন্টিটি — Remount দিয়ে স্টেট রিসেট",
        en: "Key Prop as Component Identity — Resetting State via Remount",
      },
    },
  },
  "react-rendering-performance/react-compiler-auto-memoization": {
    Body: ReactCompilerAutoMemoization,
    headings: reactCompilerAutoMemoizationHeadings,
    cover: {
      src: ch10Topic9Cover,
      alt: {
        bn: "রিঅ্যাক্ট কম্পাইলার ও Auto-memoization — Next.js 15 সেটআপ",
        en: "React Compiler & Auto-memoization — Next.js 15 Setup",
      },
    },
  },
  "react-rendering-performance/performance-budget-monitoring": {
    Body: PerformanceBudgetMonitoring,
    headings: performanceBudgetMonitoringHeadings,
    cover: {
      src: ch10Topic10Cover,
      alt: {
        bn: "পারফরম্যান্স বাজেট ও মনিটরিং — Profiler ও Core Web Vitals",
        en: "Performance Budget & Monitoring — Profiler & Core Web Vitals",
      },
    },
  },

  // ── Chapter 11 — Bundle & JavaScript Performance ─────────────────
  "bundle-optimization/tree-shaking-dead-code-elimination": {
    Body: TreeShakingDeadCodeElimination,
    headings: treeShakingDeadCodeEliminationHeadings,
    cover: {
      src: ch11Topic1Cover,
      alt: {
        bn: "Tree Shaking ও Dead Code Elimination — Static Analysis পাইপলাইন",
        en: "Tree Shaking & Dead Code Elimination — the Static Analysis Pipeline",
      },
    },
  },
  "bundle-optimization/esm-vs-cjs": {
    Body: EsmVsCjs,
    headings: esmVsCjsHeadings,
    cover: {
      src: ch11Topic2Cover,
      alt: {
        bn: "ESM বনাম CJS — Scope Hoisting ও Dual Package Hazard",
        en: "ESM vs CJS — Scope Hoisting & the Dual Package Hazard",
      },
    },
  },
  "bundle-optimization/bundle-splitting-chunking": {
    Body: BundleSplittingChunking,
    headings: bundleSplittingChunkingHeadings,
    cover: {
      src: ch11Topic3Cover,
      alt: {
        bn: "Bundle Splitting ও Chunking — Monolithic বনাম Granular চ্যাঙ্ক",
        en: "Bundle Splitting & Chunking — Monolithic vs Granular Chunks",
      },
    },
  },
  "bundle-optimization/dynamic-imports": {
    Body: DynamicImports,
    headings: dynamicImportsHeadings,
    cover: {
      src: ch11Topic4Cover,
      alt: {
        bn: "Dynamic Imports — next/dynamic ও Intent-based Preloading",
        en: "Dynamic Imports — next/dynamic & Intent-based Preloading",
      },
    },
  },
  "bundle-optimization/package-optimization-optimizepackageimports-modularizeimports": {
    Body: PackageOptimization,
    headings: packageOptimizationHeadings,
    cover: {
      src: ch11Topic5Cover,
      alt: {
        bn: "Package Optimization — Barrel File বনাম SWC ইমপোর্ট রিরাইট",
        en: "Package Optimization — Barrel Files vs SWC Import Rewriting",
      },
    },
  },
  "bundle-optimization/package-json-optimization": {
    Body: PackageJsonOptimization,
    headings: packageJsonOptimizationHeadings,
    cover: {
      src: ch11Topic6Cover,
      alt: {
        bn: "package.json অপটিমাইজেশন — dependencies, peerDependencies ও sideEffects",
        en: "package.json Optimization — dependencies, peerDependencies & sideEffects",
      },
    },
  },
  "bundle-optimization/dependency-analysis": {
    Body: DependencyAnalysis,
    headings: dependencyAnalysisHeadings,
    cover: {
      src: ch11Topic7Cover,
      alt: {
        bn: "Dependency Analysis — Knip ও depcheck দিয়ে জম্বি প্যাকেজ শনাক্তকরণ",
        en: "Dependency Analysis — Finding Zombie Packages with Knip & depcheck",
      },
    },
  },
  "bundle-optimization/bundle-analyzer": {
    Body: BundleAnalyzer,
    headings: bundleAnalyzerHeadings,
    cover: {
      src: ch11Topic8Cover,
      alt: {
        bn: "Bundle Analyzer — @next/bundle-analyzer সেটআপ ও ট্রিম্যাপ পড়া",
        en: "Bundle Analyzer — @next/bundle-analyzer Setup & Reading Treemaps",
      },
    },
  },
  "bundle-optimization/dynamic-imports-react-lazy-ssr-options": {
    Body: DynamicImportsReactLazySsr,
    headings: dynamicImportsReactLazySsrHeadings,
    cover: {
      src: ch11Topic9Cover,
      alt: {
        bn: "Dynamic Imports, React.lazy ও SSR অপশন — window এরর এড়ানো",
        en: "Dynamic Imports, React.lazy & SSR Options — Avoiding window Errors",
      },
    },
  },
  "bundle-optimization/duplicate-dependencies": {
    Body: DuplicateDependencies,
    headings: duplicateDependenciesHeadings,
    cover: {
      src: ch11Topic10Cover,
      alt: {
        bn: "Duplicate Dependencies — ডিটেকশন ও overrides দিয়ে ডিডুপ্লিকেশন",
        en: "Duplicate Dependencies — Detection & Deduplication via overrides",
      },
    },
  },
  // ── Chapter 12 — Advanced Code Splitting & Loading ────────────────
  "code-splitting-loading/route-level-code-splitting": {
    Body: RouteLevelCodeSplitting,
    headings: routeLevelCodeSplittingHeadings,
    cover: {
      src: ch12Topic1Cover,
      alt: {
        bn: "Route-লেভেল কোড স্প্লিটিং — মনোলিথিক বান্ডল বনাম রুট চ্যাঙ্ক",
        en: "Route-level Code Splitting — Monolithic Bundle vs Route Chunks",
      },
    },
  },
  "code-splitting-loading/component-level-code-splitting": {
    Body: ComponentLevelCodeSplitting,
    headings: componentLevelCodeSplittingHeadings,
    cover: {
      src: ch12Topic2Cover,
      alt: {
        bn: "Component-লেভেল কোড স্প্লিটিং — অফ-স্ক্রিন UI-এর অন-ডিমান্ড লোডিং",
        en: "Component-level Code Splitting — On-demand Loading for Off-screen UI",
      },
    },
  },
  "code-splitting-loading/next-dynamic": {
    Body: NextDynamic,
    headings: nextDynamicHeadings,
    cover: {
      src: ch12Topic3Cover,
      alt: {
        bn: "next/dynamic — Named export, ssr অপশন ও intent prefetching",
        en: "next/dynamic — Named Exports, ssr Options & Intent Prefetching",
      },
    },
  },
  "code-splitting-loading/lazy-loading-strategy": {
    Body: LazyLoadingStrategy,
    headings: lazyLoadingStrategyHeadings,
    cover: {
      src: ch12Topic4Cover,
      alt: {
        bn: "Lazy Loading স্ট্র্যাটেজি — Intersection Observer ও scroll-based import",
        en: "Lazy Loading Strategy — Intersection Observer & Scroll-based Imports",
      },
    },
  },
  "code-splitting-loading/heavy-third-party-library-isolation": {
    Body: HeavyThirdPartyLibraryIsolation,
    headings: heavyThirdPartyLibraryIsolationHeadings,
    cover: {
      src: ch12Topic5Cover,
      alt: {
        bn: "ভারী থার্ড-পার্টি লাইব্রেরি আইসোলেশন — Moment, Chart.js ও PDF ইঞ্জিন",
        en: "Heavy Third-party Library Isolation — Moment, Chart.js & PDF Engines",
      },
    },
  },
  "code-splitting-loading/client-only-package-loading": {
    Body: ClientOnlyPackageLoading,
    headings: clientOnlyPackageLoadingHeadings,
    cover: {
      src: ch12Topic6Cover,
      alt: {
        bn: "Client-only প্যাকেজ লোডিং — window/document এরর প্রতিরোধ",
        en: "Client-only Package Loading — Preventing window/document Errors",
      },
    },
  },
  "code-splitting-loading/above-the-fold-vs-below-the-fold-loading": {
    Body: AboveTheFoldVsBelowTheFoldLoading,
    headings: aboveTheFoldVsBelowTheFoldLoadingHeadings,
    cover: {
      src: ch12Topic7Cover,
      alt: {
        bn: "Above-the-fold বনাম Below-the-fold লোডিং — priority ও deferred hydration",
        en: "Above-the-fold vs Below-the-fold Loading — Priority & Deferred Hydration",
      },
    },
  },
  "code-splitting-loading/route-pre-fetching-optimization": {
    Body: RoutePreFetchingOptimization,
    headings: routePreFetchingOptimizationHeadings,
    cover: {
      src: ch12Topic8Cover,
      alt: {
        bn: "Route Pre-fetching অপটিমাইজেশন — bandwidth bloat এড়ানো",
        en: "Route Pre-fetching Optimization — Avoiding Bandwidth Bloat",
      },
    },
  },
  "code-splitting-loading/image-font-optimization": {
    Body: ImageFontOptimization,
    headings: imageFontOptimizationHeadings,
    cover: {
      src: ch12Topic9Cover,
      alt: {
        bn: "Image ও Font অপটিমাইজেশন — next/image, next/font ও CLS প্রতিরোধ",
        en: "Image & Font Optimization — next/image, next/font & CLS Prevention",
      },
    },
  },
  "code-splitting-loading/chunk-duplication-production-bundle-budget": {
    Body: ChunkDuplicationProductionBundleBudget,
    headings: chunkDuplicationProductionBundleBudgetHeadings,
    cover: {
      src: ch12Topic10Cover,
      alt: {
        bn: "Chunk ডুপ্লিকেশন অ্যানালাইসিস ও প্রোডাকশন বান্ডল বাজেট",
        en: "Chunk Duplication Analysis & Production Bundle Budget",
      },
    },
  },
};
