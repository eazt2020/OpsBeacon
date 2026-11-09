System.register(['react', '@grafana/data'], (function (exports) {
  'use strict';
  var React, useState, useEffect, useMemo, useRef, AppPlugin;
  return {
    setters: [function (module) {
      React = module.default;
      useState = module.useState;
      useEffect = module.useEffect;
      useMemo = module.useMemo;
      useRef = module.useRef;
    }, function (module) {
      AppPlugin = module.AppPlugin;
    }],
    execute: (function () {

      const TONE = {
        blue: { tone: "#2f9bff", bg: "rgba(47, 155, 255, 0.12)" },
        green: { tone: "#00e676", bg: "rgba(0, 230, 118, 0.12)" },
        red: { tone: "#ff3d57", bg: "rgba(255, 61, 87, 0.12)" },
        yellow: { tone: "#ffc107", bg: "rgba(255, 193, 7, 0.12)" },
        orange: { tone: "#ff8a3d", bg: "rgba(255, 138, 61, 0.12)" },
        purple: { tone: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)" },
        cyan: { tone: "#00d4ff", bg: "rgba(0, 212, 255, 0.12)" },
        gray: { tone: "#8ea3bf", bg: "rgba(142, 163, 191, 0.10)" }
      };
      const GROUP_COLOR = {
        PROD: "#2f9bff",
        DR: "#8b5cf6",
        UAT: "#00d4ff"
      };
      const HEALTH_COLOR$1 = {
        healthy: "#00d47e",
        warning: "#ffc107",
        critical: "#ff3b30",
        stale: "#8f9298",
        maintenance: "#22d3ee",
        unavailable: "#a855f7"
      };
      const FILTER_KEYS = ["environment", "tier", "hostGroup", "os", "businessService"];
      const FILTERS_STORAGE_KEY = "opsbeacon-filters-open";
      function filtersStorageKey() {
        if (typeof window === "undefined") {
          return FILTERS_STORAGE_KEY;
        }
        return `${FILTERS_STORAGE_KEY}:${window.location.pathname}`;
      }
      const fmt$2 = (n) => n.toLocaleString("en-US");
      function BrandMark({ logoUrl, className }) {
        return /* @__PURE__ */ React.createElement("div", { className: `cc-logo${logoUrl ? " cc-logo-image" : ""}${className ? ` ${className}` : ""}`, "aria-hidden": "true" }, logoUrl ? /* @__PURE__ */ React.createElement("img", { src: logoUrl, alt: "" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { background: "#28a9ff" } }), /* @__PURE__ */ React.createElement("span", { style: { background: "#00d47e" } }), /* @__PURE__ */ React.createElement("span", { style: { background: "#ffb020" } })));
      }
      function Icon({ name, size = 16 }) {
        const common = {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.8,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        };
        switch (name) {
          case "server":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "6", rx: "1.6" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14", width: "18", height: "6", rx: "1.6" }), /* @__PURE__ */ React.createElement("path", { d: "M7 7h.01M7 17h.01M11 7h.01M11 17h.01" }));
          case "check":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "m8 12 2.6 2.6L16 9" }));
          case "x":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "m9 9 6 6M15 9l-6 6" }));
          case "alert":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 9v4M12 17h.01" }));
          case "bell":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }), /* @__PURE__ */ React.createElement("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" }));
          case "bell-off":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M13.7 21a2 2 0 0 1-3.4 0M18 8a6 6 0 0 0-9.3-5.2M6 8c0 7-3 9-3 9h13" }), /* @__PURE__ */ React.createElement("path", { d: "m2 2 20 20" }));
          case "wrench":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.6-.7-.7-2.6Z" }));
          case "db":
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("ellipse", { cx: "12", cy: "5", rx: "8", ry: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }), /* @__PURE__ */ React.createElement("path", { d: "M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" }));
          default:
            return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }));
        }
      }
      function HeaderClock() {
        const [now, setNow] = useState(() => /* @__PURE__ */ new Date());
        useEffect(() => {
          const timer = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
          return () => window.clearInterval(timer);
        }, []);
        const date = now.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Singapore"
        });
        const time = now.toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Singapore"
        });
        return /* @__PURE__ */ React.createElement("div", { className: "cc-clock" }, /* @__PURE__ */ React.createElement("div", { className: "cc-clock-date" }, date), /* @__PURE__ */ React.createElement("div", { className: "cc-clock-time" }, time), /* @__PURE__ */ React.createElement("div", { className: "cc-clock-zone" }, "(GMT+8)"));
      }
      function Header({
        filters,
        onChange,
        options,
        source,
        onSource,
        connection,
        version,
        hostCount,
        lastSync,
        canGoLive,
        sampleEnabled = true,
        brandName = "OPSBEACON",
        brandTagline = "REAL-TIME INFRASTRUCTURE HEALTH",
        logoUrl,
        title = "INFRASTRUCTURE OPERATIONS COMMAND CENTER",
        subtitle = "All Servers  |  500 - 1,500 Servers  |  Real-time Infrastructure Health from Zabbix"
      }) {
        const [filtersOpen, setFiltersOpen] = useState(() => {
          if (typeof window === "undefined") {
            return true;
          }
          try {
            return window.localStorage.getItem(filtersStorageKey()) !== "closed";
          } catch (e) {
            return true;
          }
        });
        useEffect(() => {
          try {
            window.localStorage.setItem(filtersStorageKey(), filtersOpen ? "open" : "closed");
          } catch (e) {
          }
        }, [filtersOpen]);
        const activeValues = FILTER_KEYS.map((key) => filters[key]).filter((value) => value !== "All");
        const filtersActive = activeValues.length > 0;
        const resetFilters = () => FILTER_KEYS.forEach((key) => onChange(key, "All"));
        return /* @__PURE__ */ React.createElement("div", { className: "cc-header" }, /* @__PURE__ */ React.createElement("div", { className: "cc-brand" }, /* @__PURE__ */ React.createElement(BrandMark, { logoUrl }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-eyebrow" }, brandName, " ", /* @__PURE__ */ React.createElement("span", null, "\xB7"), " ", brandTagline), /* @__PURE__ */ React.createElement("div", { className: "cc-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "cc-subtitle" }, subtitle))), /* @__PURE__ */ React.createElement(
          "div",
          {
            className: `cc-header-filters${filtersOpen ? "" : " collapsed"}${filtersActive ? " is-filtered" : ""}`,
            role: "group",
            "aria-label": "Dashboard filters"
          },
          /* @__PURE__ */ React.createElement(
            "button",
            {
              type: "button",
              className: "cc-filter-toggle",
              "aria-expanded": filtersOpen,
              title: filtersOpen ? "Hide filters" : "Show filters",
              onClick: () => setFiltersOpen((open) => !open)
            },
            /* @__PURE__ */ React.createElement("span", { className: "cc-filter-caret", "aria-hidden": "true" }, "\u25BE"),
            /* @__PURE__ */ React.createElement("span", null, "Filters"),
            filtersActive ? /* @__PURE__ */ React.createElement("span", { className: "cc-filter-badge" }, activeValues.length) : null
          ),
          /* @__PURE__ */ React.createElement("span", { className: "cc-filter-summary", hidden: !filtersActive }, activeValues.join(" \xB7 ")),
          /* @__PURE__ */ React.createElement("div", { className: "cc-filter-controls" }, /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Environment"), /* @__PURE__ */ React.createElement("select", { value: filters.environment, onChange: (e) => onChange("environment", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.environments.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "System Tier"), /* @__PURE__ */ React.createElement("select", { value: filters.tier, onChange: (e) => onChange("tier", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.tiers.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Host Group"), /* @__PURE__ */ React.createElement("select", { value: filters.hostGroup, onChange: (e) => onChange("hostGroup", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.groups.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "OS Type"), /* @__PURE__ */ React.createElement("select", { value: filters.os, onChange: (e) => onChange("os", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.os.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Business Service"), /* @__PURE__ */ React.createElement("select", { value: filters.businessService, onChange: (e) => onChange("businessService", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.services.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-filter-reset", title: "Reset filters", onClick: resetFilters }, "Reset"))
        ), /* @__PURE__ */ React.createElement("div", { className: "cc-header-right" }, canGoLive ? sampleEnabled ? /* @__PURE__ */ React.createElement("div", { className: "cc-mode" }, /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: source === "sample" ? "active" : "",
            onClick: () => onSource("sample")
          },
          "SAMPLE"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: source === "live" ? "active" : "",
            onClick: () => onSource("live")
          },
          "LIVE"
        )) : /* @__PURE__ */ React.createElement("div", { className: "cc-mode", title: "Sample data is disabled in the plugin configuration" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mode-note" }, "LIVE ONLY")) : null, /* @__PURE__ */ React.createElement(HeaderClock, null), /* @__PURE__ */ React.createElement("div", { className: `cc-zabbix is-${connection}` }, /* @__PURE__ */ React.createElement("span", { className: "cc-zabbix-dot" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-zabbix-label" }, "ZABBIX"), /* @__PURE__ */ React.createElement("div", { className: "cc-zabbix-sub" }, connection === "sample" ? "Sample dataset \xB7 no API calls" : connection === "loading" ? "Connecting to Zabbix API\u2026" : connection === "ready" ? `v${version || "?"} \xB7 ${fmt$2(hostCount || 0)} hosts \xB7 sync ${lastSync || "\u2014"}` : "Connection failed")), /* @__PURE__ */ React.createElement(
          "span",
          {
            className: `cc-sample-badge ${connection === "ready" ? "is-live" : ""} ${connection === "error" ? "is-error" : ""}`
          },
          connection === "sample" ? "SAMPLE" : connection === "loading" ? "SYNC" : connection === "ready" ? "LIVE" : "ERROR"
        ))));
      }
      const SEVERITY_RANK = { Critical: 0, High: 1, Warning: 2, Info: 3 };
      function LiveProblemsTicker({
        problems,
        onHost
      }) {
        const ranked = useMemo(() => {
          const sorted = [...problems].sort(
            (a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9) || b.minutesAgo - a.minutesAgo
          );
          const take = (group, n) => sorted.filter((p) => p.severityGroup === group).slice(0, n);
          const picks = [...take("Critical", 10), ...take("Warning", 3), ...take("Info", 1)];
          const seen = new Set(picks.map((p) => p.id));
          for (const p of sorted) {
            if (picks.length >= 14) {
              break;
            }
            if (!seen.has(p.id)) {
              picks.push(p);
              seen.add(p.id);
            }
          }
          return picks;
        }, [problems]);
        const items = ranked;
        const trackRef = useRef(null);
        const [duration, setDuration] = useState(80);
        useEffect(() => {
          const track = trackRef.current;
          if (!track) {
            return;
          }
          const measure = () => {
            const setWidth = track.scrollWidth / 2;
            if (setWidth > 0) {
              setDuration(Math.min(400, Math.max(45, Math.round(setWidth / 46))));
            }
          };
          measure();
          if (typeof ResizeObserver === "undefined") {
            return;
          }
          const observer = new ResizeObserver(measure);
          observer.observe(track);
          return () => observer.disconnect();
        }, [items.length]);
        if (items.length === 0) {
          return null;
        }
        const renderSet = (hidden) => /* @__PURE__ */ React.createElement("div", { className: "cc-ticker-set", "aria-hidden": hidden ? "true" : void 0 }, items.map((p, i) => /* @__PURE__ */ React.createElement("span", { className: "cc-ticker-item", key: `${p.id}-${i}` }, /* @__PURE__ */ React.createElement("span", { className: `cc-sev cc-ticker-sev cc-sev-${p.severity.toLowerCase()}` }, p.severity), p.problem, onHost ? /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "cc-ticker-host",
            tabIndex: hidden ? -1 : void 0,
            onClick: () => onHost(p.hostname)
          },
          p.hostname
        ) : /* @__PURE__ */ React.createElement("b", null, p.hostname), /* @__PURE__ */ React.createElement("em", null, p.duration))), /* @__PURE__ */ React.createElement("span", { className: "cc-ticker-gap", key: "gap-end", "aria-hidden": "true" }));
        return /* @__PURE__ */ React.createElement("div", { className: "cc-ticker", "aria-label": "Active problems" }, /* @__PURE__ */ React.createElement("div", { className: "cc-ticker-label" }, /* @__PURE__ */ React.createElement("span", { className: "cc-live-dot amber", "aria-hidden": "true" }), "LIVE PROBLEMS"), /* @__PURE__ */ React.createElement("div", { className: "cc-ticker-viewport" }, /* @__PURE__ */ React.createElement("div", { className: "cc-ticker-track", ref: trackRef, style: { animationDuration: `${duration}s` } }, renderSet(false), renderSet(true))));
      }
      function Kpi({
        icon,
        label,
        value,
        sub,
        delta,
        deltaTone,
        tone,
        href
      }) {
        const t = TONE[tone];
        const body = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "cc-kpi-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 15 })), /* @__PURE__ */ React.createElement("div", { className: "cc-kpi-body" }, /* @__PURE__ */ React.createElement("div", { className: "cc-kpi-label" }, label), /* @__PURE__ */ React.createElement("div", { className: "cc-kpi-value" }, value), /* @__PURE__ */ React.createElement("div", { className: "cc-kpi-sub" }, sub, delta ? /* @__PURE__ */ React.createElement("span", { className: "cc-kpi-delta", style: { color: deltaTone === "good" ? "#00d47e" : "#ff8a3d" } }, delta) : null)));
        const style = { "--tone": t.tone, "--tone-bg": t.bg };
        const alert = tone === "red";
        const className = `cc-kpi${alert ? " cc-kpi-alert" : ""}`;
        const beam = alert ? /* @__PURE__ */ React.createElement("span", { className: "cc-beam", "aria-hidden": "true" }) : null;
        if (href) {
          return /* @__PURE__ */ React.createElement(
            "a",
            {
              className: `${className} cc-kpi-link`,
              style,
              "data-tone": tone,
              href,
              title: `Open the server list for ${label.toLowerCase()}`
            },
            beam,
            body
          );
        }
        return /* @__PURE__ */ React.createElement("div", { className, style, "data-tone": tone }, beam, body);
      }
      function UtilCard({
        title,
        sub,
        avg,
        critical,
        warning,
        normal,
        accent
      }) {
        const rounded = Math.round(avg);
        const band = avg >= 90 ? { color: "#ff4d67", label: "Critical" } : avg >= 70 ? { color: "#ffc107", label: "Warning" } : { color: "#00d47e", label: "Normal" };
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel", style: { "--accent": accent } }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, sub)), /* @__PURE__ */ React.createElement("div", { className: "cc-util-body" }, /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "cc-ring",
            style: { "--p": rounded, "--fill": band.color },
            role: "img",
            "aria-label": `${title}: ${rounded}% average, ${band.label} band`
          },
          /* @__PURE__ */ React.createElement("div", { className: "cc-ring-inner" }, /* @__PURE__ */ React.createElement("strong", null, rounded, "%"), /* @__PURE__ */ React.createElement("span", null, "avg"))
        ), /* @__PURE__ */ React.createElement("div", { className: "cc-util-right" }, /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "cc-stackbar",
            role: "img",
            "aria-label": `${fmt$2(critical)} critical, ${fmt$2(warning)} warning, ${fmt$2(normal)} normal`
          },
          /* @__PURE__ */ React.createElement("span", { className: "cc-seg crit", style: { flexGrow: critical } }),
          /* @__PURE__ */ React.createElement("span", { className: "cc-seg warn", style: { flexGrow: warning } }),
          /* @__PURE__ */ React.createElement("span", { className: "cc-seg ok", style: { flexGrow: normal } })
        ), /* @__PURE__ */ React.createElement("div", { className: "cc-legend" }, /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ff4d67" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Critical (\u2265 90%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$2(critical))), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ffc107" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Warning (70\u201390%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$2(warning))), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#00d47e" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Normal (< 70%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$2(normal)))))));
      }
      function groupCounts(hosts) {
        return {
          healthy: hosts.filter((h) => h.health === "healthy").length,
          warning: hosts.filter((h) => h.health === "warning").length,
          critical: hosts.filter((h) => h.health === "critical").length,
          stale: hosts.filter((h) => h.health === "stale").length,
          maintenance: hosts.filter((h) => h.health === "maintenance").length,
          unavailable: hosts.filter((h) => h.health === "unavailable").length
        };
      }
      function GroupPanel({
        group: g,
        onSelect
      }) {
        const c = groupCounts(g.tiers.flatMap((t) => t.hosts));
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-group", style: { "--group": GROUP_COLOR[g.key] } }, /* @__PURE__ */ React.createElement("div", { className: "cc-group-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-group-name" }, /* @__PURE__ */ React.createElement("span", { className: `cc-env-dot ${g.key.toLowerCase()}`, "aria-hidden": "true" }), g.name, /* @__PURE__ */ React.createElement("span", { className: "cc-group-total" }, fmt$2(g.total))), /* @__PURE__ */ React.createElement("div", { className: "cc-group-legend" }, /* @__PURE__ */ React.createElement("span", { className: "cc-lg ok" }, /* @__PURE__ */ React.createElement("i", null), fmt$2(c.healthy), " healthy"), /* @__PURE__ */ React.createElement("span", { className: "cc-lg warn" }, /* @__PURE__ */ React.createElement("i", null), fmt$2(c.warning), " warning"), /* @__PURE__ */ React.createElement("span", { className: "cc-lg crit" }, /* @__PURE__ */ React.createElement("i", null), fmt$2(c.critical), " critical"), /* @__PURE__ */ React.createElement("span", { className: "cc-lg other" }, /* @__PURE__ */ React.createElement("i", null), fmt$2(c.stale + c.maintenance + c.unavailable), " other"))), /* @__PURE__ */ React.createElement("div", { className: "cc-grid-wrap" }, g.tiers.map((tier) => {
          const tc = groupCounts(tier.hosts);
          return /* @__PURE__ */ React.createElement("div", { className: "cc-tier-row", key: tier.name }, /* @__PURE__ */ React.createElement("div", { className: "cc-tier-label" }, /* @__PURE__ */ React.createElement("div", { className: "cc-tier-title" }, tier.name), /* @__PURE__ */ React.createElement("div", { className: "cc-tier-sub" }, tier.subtitle, " (", fmt$2(tier.hosts.length), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-tier-counts" }, /* @__PURE__ */ React.createElement("span", { style: { color: HEALTH_COLOR$1.healthy }, title: `${tc.healthy} healthy` }, tc.healthy), /* @__PURE__ */ React.createElement("span", { style: { color: HEALTH_COLOR$1.warning }, title: `${tc.warning} warning` }, tc.warning), /* @__PURE__ */ React.createElement("span", { style: { color: HEALTH_COLOR$1.critical }, title: `${tc.critical} critical` }, tc.critical), /* @__PURE__ */ React.createElement("span", { style: { color: HEALTH_COLOR$1.stale }, title: `${tc.stale} stale` }, tc.stale))), /* @__PURE__ */ React.createElement("div", { className: "cc-host-grid" }, tier.hosts.map((h) => /* @__PURE__ */ React.createElement(
            "button",
            {
              key: h.id,
              type: "button",
              className: `cc-cell cc-cell-btn cc-cell-${h.health}`,
              title: `${h.hostname} \xB7 ${h.health} \xB7 CPU ${h.cpu}% \xB7 Memory ${h.memory}% \xB7 Disk ${h.disk}%`,
              "aria-label": `Open server statistics for ${h.hostname}, health ${h.health}`,
              tabIndex: -1,
              onClick: () => onSelect && onSelect(h)
            }
          )), tier.hosts.length === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { fontSize: 8 } }, "No hosts match filters") : null));
        })), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-inline" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: HEALTH_COLOR$1.healthy } }), " Healthy"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: HEALTH_COLOR$1.warning } }), " Warning"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: HEALTH_COLOR$1.critical } }), " Critical"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot cc-dot-stale" }), " Stale"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: HEALTH_COLOR$1.maintenance } }), " Maintenance"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: HEALTH_COLOR$1.unavailable } }), " Unavailable")));
      }
      function GroupGrids({
        groups,
        onSelect
      }) {
        return /* @__PURE__ */ React.createElement("div", { className: "cc-groups" }, groups.map((g) => /* @__PURE__ */ React.createElement(GroupPanel, { key: g.key, group: g, onSelect })));
      }
      function rowLinkProps(href) {
        if (!href) {
          return {};
        }
        const open = () => {
          if (typeof window !== "undefined") {
            window.location.href = href;
          }
        };
        return {
          className: "cc-row-link",
          role: "link",
          tabIndex: 0,
          title: "Open the server list for this row",
          onClick: open,
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open();
            }
          }
        };
      }
      function BusinessServicesTable({
        rows,
        href
      }) {
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "Business Services Impact"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, rows.length, " services")), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Business Service"), /* @__PURE__ */ React.createElement("th", null, "Env"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Servers"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Active Problems"))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r, i) => {
          const link = href ? href(r) : void 0;
          return /* @__PURE__ */ React.createElement("tr", { key: r.name, ...rowLinkProps(link) }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, link ? /* @__PURE__ */ React.createElement(
            "a",
            {
              className: "cc-row-anchor",
              href: link,
              onClick: (event) => event.stopPropagation()
            },
            r.name,
            /* @__PURE__ */ React.createElement("span", { className: "cc-row-arrow" }, "\u203A")
          ) : r.name), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.env), /* @__PURE__ */ React.createElement("td", { className: "num" }, fmt$2(r.servers)), /* @__PURE__ */ React.createElement("td", { className: `cc-status cc-status-${r.status.toLowerCase()}` }, r.status), /* @__PURE__ */ React.createElement("td", { className: "num", style: { color: r.activeProblems > 0 ? "#ff8a3d" : "#00d47e" } }, r.activeProblems));
        }), rows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "cc-muted" }, "No services match the current filters.")) : null))));
      }
      function statusClass(status) {
        return `cc-status cc-status-${status.toLowerCase()}`;
      }
      function DrTable({
        rows,
        href
      }) {
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "DR Readiness & Replication Health"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, rows.length, " components")), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Service / Component"), /* @__PURE__ */ React.createElement("th", null, "PROD Status"), /* @__PURE__ */ React.createElement("th", null, "DR Status"), /* @__PURE__ */ React.createElement("th", null, "Replication Lag"), /* @__PURE__ */ React.createElement("th", null, "Last Sync"))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r) => {
          const link = href ? href(r) : void 0;
          return /* @__PURE__ */ React.createElement("tr", { key: r.name, ...rowLinkProps(link) }, /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, link ? /* @__PURE__ */ React.createElement(
            "a",
            {
              className: "cc-row-anchor",
              href: link,
              onClick: (event) => event.stopPropagation()
            },
            r.name,
            /* @__PURE__ */ React.createElement("span", { className: "cc-row-arrow" }, "\u203A")
          ) : r.name), /* @__PURE__ */ React.createElement("td", { className: statusClass(r.prodStatus) }, r.prodStatus), /* @__PURE__ */ React.createElement("td", { className: statusClass(r.drStatus) }, r.drStatus), /* @__PURE__ */ React.createElement("td", { style: { color: r.replicationLag.includes("1h") ? "#ff4d67" : "#b9c9dd" } }, r.replicationLag), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.lastSync));
        }), rows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 5, className: "cc-muted" }, "No DR components are defined in Zabbix.")) : null))));
      }
      function Sparkline$1({ values, color }) {
        const w = 64;
        const h = 18;
        const n = values.length || 1;
        const points = values.map((v, i) => `${i / Math.max(1, n - 1) * w},${h - Math.max(0, Math.min(100, v)) / 100 * h}`).join(" ");
        return /* @__PURE__ */ React.createElement("svg", { className: "cc-spark", viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none" }, /* @__PURE__ */ React.createElement("polyline", { points, fill: "none", stroke: color, strokeWidth: "1.2" }));
      }
      const RESOURCE_LABEL = {
        cpu: "CPU",
        memory: "Memory",
        disk: "Disk"
      };
      const RESOURCE_COLOR = {
        cpu: "#ffb020",
        memory: "#8b5cf6",
        disk: "#00d47e"
      };
      function TopServersPanel({
        rows,
        resource,
        onResource,
        onHost
      }) {
        const value = (r) => r[resource];
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "Top 10 Servers by Resource Utilisation"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, RESOURCE_LABEL[resource])), /* @__PURE__ */ React.createElement("div", { className: "cc-tabs" }, ["cpu", "memory", "disk"].map((r) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: r,
            type: "button",
            className: `cc-tab ${resource === r ? "active" : ""}`,
            onClick: () => onResource(r)
          },
          RESOURCE_LABEL[r]
        ))), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Env"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", { className: "num" }, RESOURCE_LABEL[resource]), /* @__PURE__ */ React.createElement("th", null, "Trend (24h)"))), /* @__PURE__ */ React.createElement("tbody", null, rows.slice(0, 10).map((r, i) => /* @__PURE__ */ React.createElement("tr", { key: r.hostname }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, onHost ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-host-link", onClick: () => onHost(r.hostname) }, r.hostname) : r.hostname), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.environment), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.tier.replace("Tier ", "T")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "cc-bar-cell" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mini-track" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mini-fill", style: { width: `${value(r)}%`, background: RESOURCE_COLOR[resource] } })), /* @__PURE__ */ React.createElement("span", { style: { color: RESOURCE_COLOR[resource], fontWeight: 700 } }, value(r), "%"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Sparkline$1, { values: r.trends[resource], color: RESOURCE_COLOR[resource] })))), rows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "cc-muted" }, "No hosts match the current filters.")) : null))));
      }
      const ENV_ORDER = { PROD: 0, DR: 1, UAT: 2 };
      function MaintenanceTable({
        hosts,
        onHost
      }) {
        const rows = [...hosts].sort(
          (a, b) => (ENV_ORDER[a.environment] ?? 9) - (ENV_ORDER[b.environment] ?? 9) || a.tier.localeCompare(b.tier) || a.hostname.localeCompare(b.hostname)
        );
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "Servers in Maintenance (", fmt$2(hosts.length), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, "Not counted as available while the maintenance window is active")), /* @__PURE__ */ React.createElement("div", { className: "cc-maintenance-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-maintenance-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Environment"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", { className: "cc-col-secondary" }, "Business Service"), /* @__PURE__ */ React.createElement("th", { className: "cc-col-secondary" }, "OS"), /* @__PURE__ */ React.createElement("th", null, "Last Data"), /* @__PURE__ */ React.createElement("th", null, "State"))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((h, i) => /* @__PURE__ */ React.createElement("tr", { key: h.id }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, onHost ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-host-link", onClick: () => onHost(h.hostname) }, h.hostname) : h.hostname), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, h.environment), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, h.tier.replace("Tier ", "T")), /* @__PURE__ */ React.createElement("td", { className: "cc-muted cc-col-secondary" }, h.businessService), /* @__PURE__ */ React.createElement("td", { className: "cc-muted cc-col-secondary" }, h.os), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, fmt$2(h.lastSeenMin), "m ago"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "cc-maintenance-state" }, /* @__PURE__ */ React.createElement("i", { "aria-hidden": "true" }), "Maintenance")))), rows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 8, className: "cc-muted" }, "No servers are in maintenance for the current filters.")) : null)))));
      }
      function severityClass(s) {
        return `cc-sev cc-sev-${s.toLowerCase()}`;
      }
      function slaClass(s) {
        if (s === "Within SLA") return "cc-sla-within";
        if (s === "At Risk") return "cc-sla-risk";
        if (s === "Not tracked") return "cc-muted";
        return "cc-sla-breach";
      }
      function ProblemsTable({
        problems,
        tab,
        onTab,
        counts,
        source,
        refreshSeconds,
        onHost,
        title = "Active Problems",
        tabs = ["All", "Critical", "Warning", "Info"]
      }) {
        const refreshLabel = refreshSeconds && refreshSeconds >= 60 && refreshSeconds % 60 === 0 ? `${refreshSeconds / 60}m` : `${refreshSeconds || 60}s`;
        const visible = problems.filter((p) => tab === "All" || p.severityGroup === tab);
        const shown = visible;
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-problems" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, title, " (", fmt$2(problems.length), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, source === "live" ? "Live Zabbix API \xB7 read-only" : "Sample data mode \xB7 read-only")), /* @__PURE__ */ React.createElement("div", { className: "cc-problem-tabs" }, tabs.map((t) => /* @__PURE__ */ React.createElement("button", { key: t, type: "button", className: `cc-tab ${tab === t ? "active" : ""}`, onClick: () => onTab(t) }, t, " (", fmt$2(counts[t] ?? 0), ")")), /* @__PURE__ */ React.createElement("span", { className: "cc-spacer" }), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { fontSize: 8 } }, "Showing ", fmt$2(shown.length), " of ", fmt$2(problems.length))), /* @__PURE__ */ React.createElement("div", { className: "cc-problem-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-problem-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Time"), /* @__PURE__ */ React.createElement("th", null, "Severity"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Environment"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", null, "Business Service"), /* @__PURE__ */ React.createElement("th", null, "Problem"), /* @__PURE__ */ React.createElement("th", null, "Current Value"), /* @__PURE__ */ React.createElement("th", null, "Threshold"), /* @__PURE__ */ React.createElement("th", null, "Duration"), /* @__PURE__ */ React.createElement("th", null, "SLA Status"), /* @__PURE__ */ React.createElement("th", null, "Ack"), /* @__PURE__ */ React.createElement("th", null, "Maintenance"), /* @__PURE__ */ React.createElement("th", null, "Related / Impact"))), /* @__PURE__ */ React.createElement("tbody", null, shown.map((p, i) => /* @__PURE__ */ React.createElement("tr", { key: p.id }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.time), /* @__PURE__ */ React.createElement("td", { className: severityClass(p.severity) }, p.severity), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, onHost ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-host-link", onClick: () => onHost(p.hostname) }, p.hostname) : p.hostname), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.environment), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.tier.replace("Tier ", "T")), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.businessService), /* @__PURE__ */ React.createElement("td", null, p.problem), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, p.currentValue), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.threshold), /* @__PURE__ */ React.createElement("td", { className: "cc-duration" }, p.duration), /* @__PURE__ */ React.createElement("td", { className: slaClass(p.sla) }, p.sla), /* @__PURE__ */ React.createElement("td", { className: p.ack ? "cc-ack-yes" : "cc-ack-no" }, p.ack ? "Yes" : "No"), /* @__PURE__ */ React.createElement("td", { className: p.maintenance ? "cc-ack-yes" : "cc-muted" }, p.maintenance ? "Yes" : "No"), /* @__PURE__ */ React.createElement("td", { className: "cc-related" }, "\u21B3 ", p.related))), shown.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 15, className: "cc-muted" }, "No problems in this view.")) : null)))), /* @__PURE__ */ React.createElement("div", { className: "cc-footer" }, /* @__PURE__ */ React.createElement("span", null, source === "live" ? `Data source: Zabbix API \xB7 read-only \xB7 refresh: ${refreshLabel}` : "Data source: deterministic sample dataset (1,268 hosts, 76 problems) \xB7 no Zabbix calls"), /* @__PURE__ */ React.createElement("span", null, "Time zone: GMT+8")));
      }

      const PLUGIN_ID = "acme-command-center-app";
      const DEFAULT_ZABBIX_CONFIG = {
        transport: "proxy",
        apiUrl: "/api_jsonrpc.php",
        authMethod: "token",
        token: "",
        username: "",
        password: "",
        proxyPath: "zabbix-api",
        publicPath: "zabbix-public",
        refreshSeconds: 60,
        sampleDataEnabled: true,
        defaultSource: "sample",
        motion: "system",
        brandName: "OPSBEACON",
        brandTagline: "REAL-TIME INFRASTRUCTURE HEALTH",
        logoUrl: ""
      };
      function resolveSource(requested, canGoLive, sampleDataEnabled) {
        if (!canGoLive) {
          return "sample";
        }
        if (!sampleDataEnabled) {
          return "live";
        }
        return requested === "live" ? "live" : "sample";
      }
      function appSubUrl() {
        const g = globalThis.grafanaBootData;
        return g && g.settings && g.settings.appSubUrl || "";
      }
      function isGrafanaHosted() {
        return !!globalThis.grafanaBootData;
      }
      function settingsUrl() {
        return `${appSubUrl()}/api/plugins/${PLUGIN_ID}/settings`;
      }
      function cleanToken(value) {
        if (typeof value !== "string") {
          return "";
        }
        return value.trim().replace(/^Bearer\s+/i, "");
      }
      function cleanPath(value, fallback) {
        if (typeof value !== "string") {
          return fallback;
        }
        const p = value.trim().replace(/^\/+|\/+$/g, "");
        return /^[A-Za-z0-9._~/-]+$/.test(p) ? p : fallback;
      }
      function normalizeApiUrl(value, fallback = DEFAULT_ZABBIX_CONFIG.apiUrl) {
        if (typeof value !== "string") {
          return fallback;
        }
        let v = value.trim();
        if (!v) {
          return fallback;
        }
        if (v.startsWith("/")) {
          v = v.replace(/\/+$/, "");
          return /\/api_jsonrpc\.php$/i.test(v) ? v : `${v}/api_jsonrpc.php`;
        }
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) {
          v = `http://${v}`;
        }
        let parsed;
        try {
          parsed = new URL(v);
        } catch {
          return fallback;
        }
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return fallback;
        }
        let path = parsed.pathname.replace(/\/+$/, "");
        if (!/\/api_jsonrpc\.php$/i.test(path)) {
          path = `${path}/api_jsonrpc.php`;
        }
        return `${parsed.origin}${path.replace(/\/{2,}/g, "/")}`;
      }
      const MAX_LOGO_CHARS = 4e5;
      function normalizeMotion(value) {
        return value === "full" || value === "reduced" ? value : "system";
      }
      function motionAllowed(preference) {
        if (preference === "full") {
          return true;
        }
        if (preference === "reduced") {
          return false;
        }
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
          return true;
        }
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      function normalizeBrandName(value) {
        const text = typeof value === "string" ? value.trim().slice(0, 40) : "";
        return text || DEFAULT_ZABBIX_CONFIG.brandName;
      }
      function normalizeBrandTagline(value) {
        const text = typeof value === "string" ? value.trim().slice(0, 80) : "";
        return text || DEFAULT_ZABBIX_CONFIG.brandTagline;
      }
      function normalizeLogoUrl(value) {
        if (typeof value !== "string") {
          return "";
        }
        const url = value.trim();
        if (!url || url.length > MAX_LOGO_CHARS) {
          return "";
        }
        if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[a-z0-9+/=]+$/i.test(url)) {
          return url;
        }
        if (/^https?:\/\/\S+$/i.test(url)) {
          return url;
        }
        return "";
      }
      function normalizeConfig(raw) {
        const r = raw && typeof raw === "object" ? raw : {};
        const parsed = parseInt(String(r.refreshSeconds ?? ""), 10);
        const refreshSeconds = Number.isFinite(parsed) ? Math.min(3600, Math.max(15, parsed)) : DEFAULT_ZABBIX_CONFIG.refreshSeconds;
        return {
          transport: r.transport === "direct" ? "direct" : "proxy",
          apiUrl: normalizeApiUrl(r.apiUrl, DEFAULT_ZABBIX_CONFIG.apiUrl),
          authMethod: r.authMethod === "credentials" ? "credentials" : "token",
          token: cleanToken(r.token),
          username: typeof r.username === "string" ? r.username.trim() : "",
          // Do not trim passwords: leading/trailing spaces can be significant.
          password: typeof r.password === "string" ? r.password : "",
          proxyPath: cleanPath(r.proxyPath, DEFAULT_ZABBIX_CONFIG.proxyPath),
          publicPath: cleanPath(r.publicPath, DEFAULT_ZABBIX_CONFIG.publicPath),
          refreshSeconds,
          // Enabled unless the stored setting is explicitly false.
          sampleDataEnabled: r.sampleDataEnabled !== false && r.sampleDataEnabled !== "false",
          defaultSource: r.defaultSource === "live" ? "live" : "sample",
          motion: normalizeMotion(r.motion),
          brandName: normalizeBrandName(r.brandName),
          brandTagline: normalizeBrandTagline(r.brandTagline),
          logoUrl: normalizeLogoUrl(r.logoUrl)
        };
      }
      function toJsonData(config) {
        const direct = config.transport === "direct";
        const useCredentials = direct && config.authMethod === "credentials";
        return {
          transport: config.transport,
          apiUrl: normalizeApiUrl(config.apiUrl),
          authMethod: config.authMethod,
          // Only persist the secret that the selected transport/method actually uses.
          token: direct && !useCredentials ? cleanToken(config.token) : "",
          username: useCredentials ? config.username.trim() : "",
          password: useCredentials ? config.password : "",
          proxyPath: config.proxyPath,
          publicPath: config.publicPath,
          refreshSeconds: config.refreshSeconds,
          sampleDataEnabled: config.sampleDataEnabled,
          // Live-only mode cannot open on the sample dataset.
          defaultSource: config.sampleDataEnabled ? config.defaultSource : "live",
          motion: normalizeMotion(config.motion),
          brandName: normalizeBrandName(config.brandName),
          brandTagline: normalizeBrandTagline(config.brandTagline),
          logoUrl: normalizeLogoUrl(config.logoUrl)
        };
      }
      let cache = null;
      const CACHE_TTL_MS = 1e4;
      function invalidateConfigCache() {
        cache = null;
      }
      async function loadZabbixConfig(force = false) {
        if (!isGrafanaHosted()) {
          return { ...DEFAULT_ZABBIX_CONFIG };
        }
        if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
          return cache.config;
        }
        try {
          const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), 1e4) : 0;
          let res;
          try {
            res = await fetch(settingsUrl(), {
              credentials: "same-origin",
              headers: { Accept: "application/json" },
              signal: controller ? controller.signal : void 0
            });
          } finally {
            if (timer) {
              clearTimeout(timer);
            }
          }
          if (!res.ok) {
            return { ...DEFAULT_ZABBIX_CONFIG };
          }
          const body = await res.json();
          const config = normalizeConfig(body.jsonData);
          cache = { config, at: Date.now() };
          return config;
        } catch {
          return { ...DEFAULT_ZABBIX_CONFIG };
        }
      }
      async function saveZabbixConfig(config) {
        const normalized = normalizeConfig(config);
        const res = await fetch(settingsUrl(), {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ enabled: true, pinned: true, jsonData: toJsonData(normalized) })
        });
        if (!res.ok) {
          let message = `Grafana returned HTTP ${res.status}`;
          try {
            const body = await res.json();
            if (body && body.message) {
              message = body.message;
            }
          } catch {
          }
          throw new Error(message);
        }
        invalidateConfigCache();
        cache = { config: normalized, at: Date.now() };
        return normalized;
      }
      function zabbixEndpoint(config, route) {
        if (config.transport === "direct") {
          return normalizeApiUrl(config.apiUrl);
        }
        const location2 = route === "api" ? config.proxyPath : config.publicPath;
        return `${appSubUrl()}/${location2}/`;
      }
      class ZabbixAuthError extends Error {
      }
      const SESSION_TTL_MS = 15 * 6e4;
      let sessionCache = null;
      let loginInFlight = null;
      function sessionKey(config) {
        return `${zabbixEndpoint(config, "api")}|${config.username.trim()}`;
      }
      function clearSession() {
        sessionCache = null;
      }
      function isAuthMessage(message) {
        return /not authorized|session terminated|re-?login|please log ?in|permission denied/i.test(message);
      }
      function authHint(config) {
        if (config.transport !== "direct") {
          return "Grafana session expired \u2014 reload the page and sign in again.";
        }
        return config.authMethod === "credentials" ? "Zabbix rejected the session. Check the username and password in the plugin configuration." : "Zabbix rejected the API token. Check the token in the plugin configuration.";
      }
      function loginWithCredentials(config, force = false) {
        if (!config.username.trim() || !config.password) {
          return Promise.reject(
            new Error(
              "No Zabbix username/password configured. Open Administration \u2192 Plugins \u2192 Infrastructure Command Center \u2192 Zabbix connection and add them."
            )
          );
        }
        const key = sessionKey(config);
        if (force) {
          clearSession();
        }
        if (sessionCache && sessionCache.key === key && Date.now() - sessionCache.at < SESSION_TTL_MS) {
          return Promise.resolve(sessionCache.token);
        }
        if (loginInFlight && loginInFlight.key === key) {
          return loginInFlight.promise;
        }
        const promise = postRpc(
          config,
          "user.login",
          { username: config.username.trim(), password: config.password },
          "public",
          void 0
        ).then((result) => {
          const token = typeof result === "string" ? result : "";
          if (!token) {
            throw new Error("Zabbix returned an empty session token for user.login.");
          }
          sessionCache = { key, token, at: Date.now() };
          return token;
        });
        loginInFlight = { key, promise };
        const clear = () => {
          if (loginInFlight && loginInFlight.promise === promise) {
            loginInFlight = null;
          }
        };
        promise.then(clear, clear);
        return promise;
      }
      async function directAuthToken(config, force = false) {
        if (config.authMethod === "credentials") {
          return loginWithCredentials(config, force);
        }
        if (!config.token) {
          throw new Error(
            "No Zabbix API token configured. Open Administration \u2192 Plugins \u2192 Infrastructure Command Center \u2192 Zabbix connection and add a token, or switch to username/password."
          );
        }
        return config.token;
      }
      async function postRpc(config, method, params, route, token) {
        const url = zabbixEndpoint(config, route);
        const headers = { "Content-Type": "application/json-rpc" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 2e4) : 0;
        let res;
        try {
          res = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers,
            body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
            signal: controller ? controller.signal : void 0
          });
        } catch (err) {
          const reason = err?.name === "AbortError" ? "timed out after 20s" : "unreachable";
          if (config.transport === "direct") {
            const origin = typeof location !== "undefined" ? location.origin : "this Grafana origin";
            throw new Error(
              `Zabbix API ${reason} at ${url}. The Zabbix server must be reachable from ${origin}; for a remote Zabbix enable CORS for this Grafana origin (or use a same-origin reverse proxy).`
            );
          }
          throw new Error(`Grafana proxy ${reason} at ${url}. Check nginx and the Zabbix API.`);
        } finally {
          if (timer) {
            clearTimeout(timer);
          }
        }
        if (res.status === 401) {
          throw new ZabbixAuthError(authHint(config));
        }
        if (!res.ok) {
          throw new Error(`Zabbix API returned HTTP ${res.status} from ${url}`);
        }
        let body;
        try {
          body = await res.json();
        } catch {
          throw new Error(`Unexpected non-JSON response from ${url}`);
        }
        if (body.error) {
          const detail = `${body.error.message}${body.error.data ? ` \u2014 ${body.error.data}` : ""}`.trim();
          if (isAuthMessage(body.error.message)) {
            throw new ZabbixAuthError(`${detail}. ${authHint(config)}`.trim());
          }
          if (method === "user.login") {
            throw new Error(`${detail}. Check the Zabbix username and password.`);
          }
          throw new Error(detail);
        }
        return body.result;
      }
      async function zabbixRpc(config, method, params, route = "api") {
        const directApi = config.transport === "direct" && route === "api";
        const token = directApi ? await directAuthToken(config) : void 0;
        try {
          return await postRpc(config, method, params, route, token);
        } catch (err) {
          const retry = directApi && config.authMethod === "credentials" && method !== "user.login" && err instanceof ZabbixAuthError;
          if (!retry) {
            throw err;
          }
          const fresh = await directAuthToken(config, true);
          return postRpc(config, method, params, route, fresh);
        }
      }
      async function testZabbixConnection(config) {
        const version = await zabbixRpc(config, "apiinfo.version", {}, "public");
        const count = await zabbixRpc(
          config,
          "host.get",
          { countOutput: true, monitored: true },
          "api"
        );
        return {
          version: version || "unknown",
          hostCount: parseInt(String(count), 10) || 0,
          endpoint: zabbixEndpoint(config, "api"),
          account: config.transport !== "direct" ? "Grafana proxy" : config.authMethod === "credentials" ? `user ${config.username}` : "API token"
        };
      }

      function isAggregateProcCpuKey(key) {
        if (!/^proc\.cpu\.util\[/i.test(key)) {
          return false;
        }
        const args = key.slice(key.indexOf("[") + 1, -1).split(",");
        return (args[0] || "").trim() === "" && args.some((arg) => arg.trim().toLowerCase() === "total");
      }
      function isDiskUsageKey(key) {
        return /^vfs\.fs\.(dependent\.)?size\[[^\]]*pused[^\]]*\]$/i.test(key) || /^as400\.disk\.size\[[^\]]*pused[^\]]*\]$/i.test(key);
      }
      function memoryConverter(resolved) {
        if (resolved.memoryMode === "invert") {
          return (value) => clamp(100 - value);
        }
        if (resolved.memoryMode === "derived" && resolved.memoryTotalValue && resolved.memoryTotalValue > 0) {
          const total = resolved.memoryTotalValue;
          return (value) => clamp(100 - value / total * 100);
        }
        return void 0;
      }
      const MAX_POINTS = 24;
      const HISTORY_SECONDS = 24 * 60 * 60;
      const ITEM_CACHE_TTL_MS = 5 * 60 * 1e3;
      const HISTORY_RANGES = {
        "6h": { label: "6H", full: "last 6 hours", seconds: 6 * 60 * 60, points: 72 },
        "24h": { label: "24H", full: "last 24 hours", seconds: 24 * 60 * 60, points: 96 },
        "7d": { label: "7D", full: "last 7 days", seconds: 7 * 24 * 60 * 60, points: 84 },
        "30d": { label: "30D", full: "last 30 days", seconds: 30 * 24 * 60 * 60, points: 90 },
        "90d": { label: "90D", full: "last 90 days", seconds: 90 * 24 * 60 * 60, points: 90 },
        "6m": { label: "6M", full: "last 6 months", seconds: 180 * 24 * 60 * 60, points: 90 }
      };
      const HISTORY_RANGE_KEYS = ["6h", "24h", "7d", "30d", "90d", "6m"];
      function numeric$1(value) {
        const n = parseFloat(value || "");
        return Number.isFinite(n) ? n : null;
      }
      function clamp(value, min = 0, max = 100) {
        return Math.max(min, Math.min(max, value));
      }
      function round(value) {
        return Math.round(value * 10) / 10;
      }
      function hash(text) {
        let h = 2166136261;
        for (let i = 0; i < text.length; i++) {
          h ^= text.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return Math.abs(h);
      }
      function averageValues(series) {
        const valid = series.filter((values) => values.length > 0);
        if (!valid.length) {
          return [];
        }
        const length = Math.min(...valid.map((values) => values.length));
        return Array.from(
          { length },
          (_, i) => round(valid.reduce((sum, values) => sum + values[i], 0) / valid.length)
        );
      }
      function averagePoints(series) {
        const byTime = /* @__PURE__ */ new Map();
        for (const points of series) {
          for (const point of points) {
            const bucket = byTime.get(point.t) || { sum: 0, count: 0 };
            bucket.sum += point.v;
            bucket.count += 1;
            byTime.set(point.t, bucket);
          }
        }
        return Array.from(byTime.entries()).sort((a, b) => a[0] - b[0]).map(([t, bucket]) => ({ t, v: round(bucket.sum / bucket.count) }));
      }
      function downsample$1(values, buckets = MAX_POINTS) {
        if (values.length <= buckets) {
          return values;
        }
        const out = [];
        const size = values.length / buckets;
        for (let i = 0; i < buckets; i++) {
          const start = Math.floor(i * size);
          const end = Math.max(start + 1, Math.floor((i + 1) * size));
          const slice = values.slice(start, end);
          out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
        }
        return out;
      }
      function toPoints(values, points, from, to) {
        if (!values.length) {
          return [];
        }
        const out = [];
        const size = values.length / points;
        for (let i = 0; i < points; i++) {
          const start = Math.floor(i * size);
          if (start >= values.length) {
            break;
          }
          const end = Math.min(values.length, Math.max(start + 1, Math.floor((i + 1) * size)));
          const slice = values.slice(start, end);
          if (!slice.length) {
            break;
          }
          const value = slice.reduce((a, b) => a + b, 0) / slice.length;
          out.push({ t: Math.round(from + (i + 0.5) / points * (to - from)), v: round(value) });
        }
        return out;
      }
      function sampleTrend(hostname, key, current) {
        const h = hash(`${hostname}:${key}`);
        const phase = h % 100 / 13;
        const amp = 4 + h % 11;
        const values = Array.from({ length: MAX_POINTS }, (_, i) => {
          const wave = Math.sin(i / 2.7 + phase) * amp + Math.sin(i / 1.13 + phase * 1.7) * amp * 0.32 + Math.cos(i / 4.1 + phase) * amp * 0.18;
          return round(clamp(current + wave));
        });
        values[values.length - 1] = round(current);
        return values;
      }
      function sampleTrendFor(hostname, key, current, points, range) {
        const h = hash(`${hostname}:${key}:${range}`);
        const phase = h % 100 / 13;
        const amp = 4 + h % 11;
        const values = Array.from({ length: points }, (_, i) => {
          const x = i * 24 / Math.max(1, points - 1);
          const wave = Math.sin(x / 2.7 + phase) * amp + Math.sin(x / 1.13 + phase * 1.7) * amp * 0.32 + Math.cos(x / 4.1 + phase) * amp * 0.18;
          const drift = Math.sin(i / Math.max(1, points - 1) * Math.PI * 2 + phase) * amp * 0.55;
          return round(clamp(current + wave + drift));
        });
        values[values.length - 1] = round(current);
        return values;
      }
      function sampleFilesystems(host) {
        const mounts = host.os === "Windows" ? ["C:", "D:", "E:"] : host.os === "IBM i" || host.os === "AS400" ? ["/", "/QIBM/ProdData", "/QOpenSys", "/home"] : ["/", "/data", "/var", "/opt"];
        const factors = [1, 0.93, 0.82, 0.64];
        return mounts.map((mount, index) => {
          const jitter = hash(`${host.hostname}:${mount}`) % 9 - 4;
          const used = index === 0 ? host.disk : clamp(host.disk * factors[index] + jitter);
          return { mount, used: round(used) };
        }).sort((a, b) => b.used - a.used);
      }
      function sampleHostDetail(host) {
        return {
          filesystems: sampleFilesystems(host),
          trends: {
            cpu: sampleTrend(host.hostname, "cpu", host.cpu),
            memory: sampleTrend(host.hostname, "memory", host.memory),
            disk: sampleTrend(host.hostname, "disk", host.disk),
            network: sampleTrend(host.hostname, "network", host.network)
          },
          source: "sample",
          note: "SAMPLE dataset \u2014 charts are deterministic sample values, not Zabbix history."
        };
      }
      function sampleHostHistory(host, range) {
        const spec = HISTORY_RANGES[range];
        const to = Math.floor(Date.now() / 1e3);
        const from = to - spec.seconds;
        const metrics = ["cpu", "memory", "disk", "network"];
        const series = {};
        for (const key of metrics) {
          const values = sampleTrendFor(host.hostname, key, host[key], spec.points, range);
          series[key] = toPoints(values, spec.points, from, to);
        }
        return {
          range,
          from,
          to,
          series,
          filesystems: sampleFilesystems(host).map((fs) => ({
            mount: fs.mount,
            points: toPoints(
              sampleTrendFor(host.hostname, `fs:${fs.mount}`, fs.used, spec.points, range),
              spec.points,
              from,
              to
            )
          })),
          source: "sample",
          note: `SAMPLE dataset \u2014 deterministic ${spec.full}, not Zabbix history.`
        };
      }
      function fallbackHostDetail(host, message) {
        return {
          filesystems: [{ mount: host.os === "Windows" ? "C:" : "/", used: host.disk }],
          trends: {},
          source: "live",
          partial: true,
          note: message
        };
      }
      function parseMount(key) {
        const open = key.indexOf("[");
        const args = open >= 0 ? key.slice(open + 1, -1).split(",") : [];
        const mount = (args[0] || "").replace(/^"|"$/g, "");
        return mount || "/";
      }
      function makeRpc(config) {
        return (method, params) => zabbixRpc(config, method, params);
      }
      async function resolveHostItems(rpc, host) {
        const hosts = await rpc("host.get", {
          output: ["hostid"],
          filter: { host: [host.hostname] }
        });
        const hostid = hosts[0] && hosts[0].hostid;
        if (!hostid) {
          return null;
        }
        const items = await rpc("item.get", {
          output: ["itemid", "key_", "lastvalue", "value_type", "units"],
          hostids: [hostid],
          monitored: true,
          limit: 5e3
        });
        const byKey = new Map(items.map((item) => [item.key_, item]));
        let cpu = byKey.get("system.cpu.util");
        let cpuPeers = [];
        if (!cpu) {
          cpu = items.find((item) => isAggregateProcCpuKey(item.key_));
        }
        if (!cpu) {
          cpuPeers = items.filter((item) => /^hrProcessorLoad\[/i.test(item.key_));
          cpu = cpuPeers.shift();
        }
        const memoryUtil = byKey.get("vm.memory.util") || byKey.get("vm.memory.utilization");
        let memory = memoryUtil;
        let memoryMode = memoryUtil ? "percent" : void 0;
        let memoryTotal;
        let memoryTotalValue;
        if (!memory) {
          const pavailable = byKey.get("vm.memory.size[pavailable]");
          const pfree = byKey.get("vm.memory.size[pfree]");
          if (pavailable) {
            memory = pavailable;
            memoryMode = "invert";
          } else if (pfree) {
            memory = pfree;
            memoryMode = "invert";
          }
        }
        if (!memory) {
          memoryTotal = byKey.get("vm.memory.size[total]");
          memoryTotalValue = numeric$1(memoryTotal?.lastvalue) ?? void 0;
          const available = byKey.get("vm.memory.size[available]") || byKey.get("vm.memory.size[free]");
          if (available && memoryTotal && memoryTotalValue && memoryTotalValue > 0) {
            memory = available;
            memoryMode = "derived";
          } else {
            memoryTotal = void 0;
            memoryTotalValue = void 0;
          }
        }
        const filesystemByMount = /* @__PURE__ */ new Map();
        let diskItem;
        let diskUsed = -1;
        const netIn = [];
        const netOut = [];
        const isBps = (item) => /bps/i.test(item.units || "");
        for (const item of items) {
          if (isDiskUsageKey(item.key_)) {
            const used = numeric$1(item.lastvalue);
            if (used === null) {
              continue;
            }
            const mount = /^as400\.disk\.size/i.test(item.key_) ? `Disk ${parseMount(item.key_)}` : parseMount(item.key_);
            const previous = filesystemByMount.get(mount);
            if (!previous || used > previous.used) {
              filesystemByMount.set(mount, { mount, used: round(used), item });
            }
            if (used > diskUsed) {
              diskUsed = used;
              diskItem = item;
            }
          } else if ((/^net\.if\.in\[[^\]]*\]$/i.test(item.key_) || /^if(HC)?InOctets\[/i.test(item.key_) && isBps(item)) && !/errors|dropped|collisions/i.test(item.key_)) {
            netIn.push(item);
          } else if ((/^net\.if\.out\[[^\]]*\]$/i.test(item.key_) || /^if(HC)?OutOctets\[/i.test(item.key_) && isBps(item)) && !/errors|dropped|collisions/i.test(item.key_)) {
            netOut.push(item);
          }
        }
        const byTraffic = (a, b) => (numeric$1(b.lastvalue) || 0) - (numeric$1(a.lastvalue) || 0);
        return {
          hostid,
          cpu,
          cpuPeers,
          memory,
          memoryMode,
          memoryTotal,
          memoryTotalValue,
          disk: diskItem,
          // The overview chart aggregates interfaces; two busiest directions keep the
          // history request small while matching that percentage formula.
          netIn: netIn.sort(byTraffic).slice(0, 2),
          netOut: netOut.sort(byTraffic).slice(0, 2),
          filesystems: Array.from(filesystemByMount.values()).sort((a, b) => b.used - a.used)
        };
      }
      const itemCache = /* @__PURE__ */ new Map();
      function resolveHostItemsCached(rpc, host) {
        const now = Date.now();
        const hit = itemCache.get(host.hostname);
        if (hit && now - hit.at < ITEM_CACHE_TTL_MS) {
          return hit.promise;
        }
        const promise = resolveHostItems(rpc, host);
        itemCache.set(host.hostname, { at: now, promise });
        promise.catch(() => {
          if (itemCache.get(host.hostname)?.promise === promise) {
            itemCache.delete(host.hostname);
          }
        });
        return promise;
      }
      function bucketPoints(raw, points, from, to) {
        if (!raw.length) {
          return [];
        }
        const span = Math.max(1, to - from);
        const buckets = Array.from({ length: points }, () => ({ sum: 0, count: 0 }));
        for (const point of raw) {
          const index = Math.min(
            points - 1,
            Math.max(0, Math.floor((point.t - from) / span * points))
          );
          buckets[index].sum += point.v;
          buckets[index].count += 1;
        }
        const out = [];
        buckets.forEach((bucket, index) => {
          if (bucket.count) {
            out.push({
              t: Math.round(from + (index + 0.5) / points * span),
              v: round(bucket.sum / bucket.count)
            });
          }
        });
        return out;
      }
      async function historyPointsFor(rpc, item, range, from, to, convert) {
        const spec = HISTORY_RANGES[range];
        let raw = [];
        if (spec.seconds > HISTORY_SECONDS) {
          try {
            const rows = await rpc("trend.get", {
              output: ["clock", "value_avg"],
              itemids: [item.itemid],
              time_from: from,
              time_till: to,
              sortfield: "clock",
              sortorder: "ASC",
              limit: 5e3
            });
            raw = rows.map((row) => ({ t: parseInt(row.clock, 10), v: numeric$1(row.value_avg ?? row.value) })).filter((point) => Number.isFinite(point.t) && point.v !== null).map((point) => ({ t: point.t, v: convert ? convert(point.v) : point.v }));
          } catch {
          }
        }
        if (!raw.length) {
          try {
            const rows = await rpc("history.get", {
              output: "extend",
              history: parseInt(item.value_type || "0", 10) || 0,
              itemids: [item.itemid],
              time_from: from,
              time_till: to,
              sortfield: "clock",
              // Keep the newest samples when a high-frequency item exceeds the row cap.
              sortorder: "DESC",
              limit: 5e3
            });
            raw = rows.map((row) => ({ t: parseInt(row.clock, 10), v: numeric$1(row.value) })).filter((point) => Number.isFinite(point.t) && point.v !== null).map((point) => ({ t: point.t, v: convert ? convert(point.v) : point.v })).reverse();
          } catch {
            return [];
          }
        }
        return bucketPoints(raw, spec.points, from, to);
      }
      async function networkPointsFor(rpc, resolved, range, from, to) {
        const directions = [...resolved.netIn, ...resolved.netOut];
        if (!directions.length) {
          return [];
        }
        const series = (await Promise.all(directions.map((item) => historyPointsFor(rpc, item, range, from, to)))).filter((points) => points.length > 0);
        if (!series.length) {
          return [];
        }
        const byTime = /* @__PURE__ */ new Map();
        for (const points of series) {
          for (const point of points) {
            byTime.set(point.t, (byTime.get(point.t) || 0) + point.v);
          }
        }
        return Array.from(byTime.entries()).sort((a, b) => a[0] - b[0]).map(([t, sum]) => ({ t, v: round(clamp(sum / 1e9 * 100)) }));
      }
      async function cpuPointsFor(rpc, resolved, range, from, to) {
        const items = [resolved.cpu, ...resolved.cpuPeers].filter(
          (item) => !!item
        );
        if (!items.length) {
          return [];
        }
        if (items.length === 1) {
          return historyPointsFor(rpc, items[0], range, from, to);
        }
        return averagePoints(
          await Promise.all(items.map((item) => historyPointsFor(rpc, item, range, from, to)))
        );
      }
      async function fetchHostDetail(host) {
        const config = await loadZabbixConfig();
        const rpc = makeRpc(config);
        let resolved = null;
        try {
          resolved = await resolveHostItemsCached(rpc, host);
        } catch (err) {
          return fallbackHostDetail(host, `Live detail unavailable: ${err.message}`);
        }
        if (!resolved) {
          return fallbackHostDetail(host, "This host is no longer present in Zabbix.");
        }
        const filesystems = resolved.filesystems.map(({ mount, used }) => ({
          mount,
          used
        }));
        if (!filesystems.length) {
          filesystems.push({ mount: host.os === "Windows" ? "C:" : "/", used: host.disk });
        }
        const legacyHistory = (item, convert) => item ? historyValues(rpc, item, convert) : Promise.resolve([]);
        const cpuItems = [resolved.cpu, ...resolved.cpuPeers].filter(
          (item) => !!item
        );
        const [cpuSeries, memory, disk] = await Promise.all([
          Promise.all(cpuItems.map((item) => legacyHistory(item))),
          legacyHistory(resolved.memory, memoryConverter(resolved)),
          legacyHistory(resolved.disk)
        ]);
        const cpu = averageValues(cpuSeries);
        const partial = !cpu.length || !memory.length || !disk.length;
        return {
          filesystems: filesystems.slice(0, 8),
          trends: {
            ...cpu.length ? { cpu } : {},
            ...memory.length ? { memory } : {},
            ...disk.length ? { disk } : {}
          },
          source: "live",
          partial,
          note: partial ? "Live snapshot; 24 h history is unavailable for one or more items on this host." : "Fetched from Zabbix when this panel opened; sparklines cover the last 24 hours."
        };
      }
      async function historyValues(rpc, item, convert) {
        try {
          const rows = await rpc("history.get", {
            output: "extend",
            history: parseInt(item.value_type || "0", 10) || 0,
            itemids: [item.itemid],
            time_from: Math.floor(Date.now() / 1e3) - HISTORY_SECONDS,
            sortfield: "clock",
            sortorder: "DESC",
            limit: 2e3
          });
          const values = rows.map((row) => numeric$1(row.value)).filter((value) => value !== null).map((value) => convert ? convert(value) : value).reverse();
          return downsample$1(values).map(round);
        } catch {
          return [];
        }
      }
      async function fetchHostHistory(host, range) {
        const config = await loadZabbixConfig();
        const rpc = makeRpc(config);
        const spec = HISTORY_RANGES[range];
        const to = Math.floor(Date.now() / 1e3);
        const from = to - spec.seconds;
        const empty = {
          range,
          from,
          to,
          series: {},
          filesystems: [],
          source: "live",
          partial: true,
          note: "Live history is unavailable for this host."
        };
        let resolved = null;
        try {
          resolved = await resolveHostItemsCached(rpc, host);
        } catch (err) {
          return { ...empty, note: `Live history unavailable: ${err.message}` };
        }
        if (!resolved) {
          return { ...empty, note: "This host is no longer present in Zabbix." };
        }
        const [cpu, memory, disk, network, filesystems] = await Promise.all([
          cpuPointsFor(rpc, resolved, range, from, to),
          resolved.memory ? historyPointsFor(rpc, resolved.memory, range, from, to, memoryConverter(resolved)) : Promise.resolve([]),
          resolved.disk ? historyPointsFor(rpc, resolved.disk, range, from, to) : Promise.resolve([]),
          networkPointsFor(rpc, resolved, range, from, to),
          Promise.all(
            resolved.filesystems.slice(0, 8).map(async (fs) => ({
              mount: fs.mount,
              points: await historyPointsFor(rpc, fs.item, range, from, to)
            }))
          )
        ]);
        const series = {};
        if (cpu.length) {
          series.cpu = cpu;
        }
        if (memory.length) {
          series.memory = memory;
        }
        if (disk.length) {
          series.disk = disk;
        }
        if (network.length) {
          series.network = network;
        }
        const filesystemSeries = filesystems.filter((fs) => fs.points.length > 0);
        const partial = !cpu.length || !memory.length || !disk.length || !network.length;
        return {
          range,
          from,
          to,
          series,
          filesystems: filesystemSeries,
          source: "live",
          partial,
          note: partial ? `Live history is incomplete for ${spec.full}.` : `Fetched from Zabbix: ${spec.full}.`
        };
      }

      const HEALTH_COLOR = {
        healthy: "#00d47e",
        warning: "#ffc107",
        critical: "#ff3b30",
        stale: "#8f9298",
        maintenance: "#22d3ee",
        unavailable: "#a855f7"
      };
      const BAND_COLOR = (value) => value >= 90 ? "#ff3b30" : value >= 70 ? "#ffc107" : "#00d47e";
      const BAND_LABEL = (value) => value >= 90 ? "Critical" : value >= 70 ? "Warning" : "Normal";
      const METRICS = [
        { key: "cpu", label: "CPU Utilisation", accent: "#2f9bff" },
        { key: "memory", label: "Memory Utilisation", accent: "#8b5cf6" },
        { key: "disk", label: "Disk Utilisation", accent: "#00d47e" },
        { key: "network", label: "Network Utilisation", accent: "#00d4ff" }
      ];
      const HISTORY_TABS = [
        { key: "cpu", label: "CPU", color: "#2f9bff" },
        { key: "memory", label: "Memory", color: "#8b5cf6" },
        { key: "disk", label: "Disk", color: "#00d47e" },
        { key: "network", label: "Network", color: "#00d4ff" },
        { key: "filesystems", label: "Filesystems", color: "#8f9298" }
      ];
      const HISTORY_COLORS = [
        "#3987e5",
        "#d95926",
        "#199e70",
        "#c98500",
        "#d55181",
        "#008300",
        "#9085e9",
        "#e66767"
      ];
      function formatAxisTime(t, range) {
        const date = new Date(t * 1e3);
        if (range === "6h" || range === "24h") {
          return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        }
        if (range === "7d") {
          return date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
        }
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      }
      function formatTooltipTime(t) {
        return new Date(t * 1e3).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      function nearestPoint(points, t) {
        return points.reduce(
          (best, point) => Math.abs(point.t - t) < Math.abs(best.t - t) ? point : best,
          points[0]
        );
      }
      function Gauge({ value, color }) {
        const v = Math.max(0, Math.min(100, value));
        return /* @__PURE__ */ React.createElement("div", { className: "cc-gauge" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 120 70", role: "img", "aria-label": `${v.toFixed(0)} percent` }, /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M 12 60 A 48 48 0 0 1 108 60",
            fill: "none",
            stroke: "#12233c",
            strokeWidth: "9",
            strokeLinecap: "round"
          }
        ), /* @__PURE__ */ React.createElement(
          "path",
          {
            className: "cc-gauge-fill",
            d: "M 12 60 A 48 48 0 0 1 108 60",
            fill: "none",
            stroke: color,
            strokeWidth: "9",
            strokeLinecap: "round",
            pathLength: 100,
            strokeDasharray: `${v} 100`
          }
        ), [70, 90].map((tick) => {
          const angle = Math.PI * (1 - tick / 100);
          const x1 = 60 + 43 * Math.cos(angle);
          const y1 = 60 - 43 * Math.sin(angle);
          const x2 = 60 + 53 * Math.cos(angle);
          const y2 = 60 - 53 * Math.sin(angle);
          return /* @__PURE__ */ React.createElement(
            "line",
            {
              key: tick,
              x1,
              y1,
              x2,
              y2,
              stroke: "#dbe7f5",
              strokeWidth: "1.4",
              opacity: "0.55"
            }
          );
        })), /* @__PURE__ */ React.createElement("div", { className: "cc-gauge-center" }, /* @__PURE__ */ React.createElement("strong", null, v.toFixed(0)), /* @__PURE__ */ React.createElement("span", null, "%")));
      }
      function Sparkline({ values, color }) {
        if (!values || values.length < 2) {
          return /* @__PURE__ */ React.createElement("div", { className: "cc-detail-spark-empty" }, "no history");
        }
        const w = 240;
        const h = 40;
        const pad = 4;
        const n = values.length;
        const point = (value, index) => [
          pad + index * (w - pad * 2) / (n - 1),
          h - pad - Math.max(0, Math.min(100, value)) / 100 * (h - pad * 2)
        ];
        const points = values.map(point);
        const line = points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
        const area = `M ${points[0][0]},${h - pad} L ${line.replace(/ /g, " L ")} L ${points[n - 1][0]},${h - pad} Z`;
        const maxIndex = values.indexOf(Math.max(...values));
        const minIndex = values.indexOf(Math.min(...values));
        const maxPoint = points[maxIndex];
        const minPoint = points[minIndex];
        const timeLabel = (index) => index === n - 1 ? "now" : `${n - 1 - index}h ago`;
        return /* @__PURE__ */ React.createElement("svg", { className: "cc-detail-spark", viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: pad,
            y1: h - pad - 0.9 * (h - pad * 2),
            x2: w - pad,
            y2: h - pad - 0.9 * (h - pad * 2),
            stroke: "#ff3b30",
            strokeWidth: "1",
            strokeDasharray: "2 3",
            opacity: "0.35"
          }
        ), /* @__PURE__ */ React.createElement("path", { d: area, fill: color, opacity: "0.12" }), /* @__PURE__ */ React.createElement(
          "polyline",
          {
            className: "cc-spark-line",
            points: line,
            fill: "none",
            stroke: color,
            strokeWidth: "1.5",
            strokeLinejoin: "round"
          }
        ), points.map(([x, y], index) => /* @__PURE__ */ React.createElement("circle", { key: index, cx: x, cy: y, r: "1.5", fill: color, opacity: "0.95" }, /* @__PURE__ */ React.createElement("title", null, `${values[index].toFixed(1)}% \xB7 ${timeLabel(index)}`))), /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: maxPoint[0],
            cy: maxPoint[1],
            r: "3",
            fill: "#ff3b30",
            stroke: "#0a1424",
            strokeWidth: "1.2"
          },
          /* @__PURE__ */ React.createElement("title", null, `Peak ${values[maxIndex].toFixed(1)}% \xB7 ${timeLabel(maxIndex)}`)
        ), /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: minPoint[0],
            cy: minPoint[1],
            r: "3",
            fill: "#00d47e",
            stroke: "#0a1424",
            strokeWidth: "1.2"
          },
          /* @__PURE__ */ React.createElement("title", null, `Low ${values[minIndex].toFixed(1)}% \xB7 ${timeLabel(minIndex)}`)
        ));
      }
      function HistoryChart({
        series,
        from,
        to,
        range
      }) {
        const [hover, setHover] = useState(null);
        const width = 720;
        const height = 300;
        const margin = { top: 18, right: 18, bottom: 34, left: 46 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;
        const span = Math.max(1, to - from);
        const xFor = (t) => margin.left + (t - from) / span * plotW;
        const yFor = (v) => margin.top + (1 - Math.max(0, Math.min(100, v)) / 100) * plotH;
        const grid = [0, 25, 50, 75, 100];
        const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => from + f * span);
        const basePoints = series[0] ? series[0].points : [];
        const count = basePoints.length;
        const hoverIndex = hover !== null && count ? Math.min(hover, count - 1) : null;
        const hoveredT = hoverIndex !== null ? basePoints[hoverIndex].t : null;
        if (!series.length || !count) {
          return /* @__PURE__ */ React.createElement("div", { className: "cc-history-empty" }, "No samples in this window.");
        }
        const single = series.length === 1 ? series[0] : null;
        const peakIndex = single ? single.points.reduce((best, p, i, arr) => p.v > arr[best].v ? i : best, 0) : -1;
        const lowIndex = single ? single.points.reduce((best, p, i, arr) => p.v < arr[best].v ? i : best, 0) : -1;
        const areaPath = single ? `M ${xFor(single.points[0].t)},${yFor(0)} L ${single.points.map((p) => `${xFor(p.t).toFixed(1)},${yFor(p.v).toFixed(1)}`).join(" L ")} L ${xFor(single.points[single.points.length - 1].t)},${yFor(0)} Z` : "";
        return /* @__PURE__ */ React.createElement("div", { className: "cc-history-plot" }, /* @__PURE__ */ React.createElement(
          "svg",
          {
            viewBox: `0 0 ${width} ${height}`,
            role: "img",
            "aria-label": `History chart for ${series.map((s) => s.label).join(", ")} across ${range}`
          },
          grid.map((value) => /* @__PURE__ */ React.createElement("g", { key: value }, /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: margin.left,
              y1: yFor(value),
              x2: width - margin.right,
              y2: yFor(value),
              stroke: "rgba(255,255,255,0.07)",
              strokeWidth: "1"
            }
          ), /* @__PURE__ */ React.createElement(
            "text",
            {
              x: margin.left - 8,
              y: yFor(value) + 3,
              textAnchor: "end",
              className: "cc-history-axis-label"
            },
            value,
            "%"
          ))),
          single ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: margin.left,
              y1: yFor(90),
              x2: width - margin.right,
              y2: yFor(90),
              stroke: "#ff3b30",
              strokeWidth: "1",
              strokeDasharray: "4 4",
              opacity: "0.35"
            }
          ), /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: margin.left,
              y1: yFor(70),
              x2: width - margin.right,
              y2: yFor(70),
              stroke: "#ffc107",
              strokeWidth: "1",
              strokeDasharray: "4 4",
              opacity: "0.28"
            }
          )) : null,
          /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: margin.left,
              y1: height - margin.bottom,
              x2: width - margin.right,
              y2: height - margin.bottom,
              stroke: "rgba(255,255,255,0.16)",
              strokeWidth: "1"
            }
          ),
          xTicks.map((t, index) => /* @__PURE__ */ React.createElement(
            "text",
            {
              key: index,
              x: xFor(t),
              y: height - 12,
              textAnchor: index === 0 ? "start" : index === xTicks.length - 1 ? "end" : "middle",
              className: "cc-history-axis-label"
            },
            formatAxisTime(t, range)
          )),
          single ? /* @__PURE__ */ React.createElement("path", { className: "cc-history-area", d: areaPath, fill: single.color }) : null,
          series.map((s, index) => /* @__PURE__ */ React.createElement(
            "polyline",
            {
              key: s.key,
              className: "cc-history-line",
              pathLength: 1,
              points: s.points.map((p) => `${xFor(p.t).toFixed(1)},${yFor(p.v).toFixed(1)}`).join(" "),
              fill: "none",
              stroke: s.color,
              strokeWidth: "2",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              style: { animationDelay: `${index * 0.07}s` }
            }
          )),
          single ? /* @__PURE__ */ React.createElement("g", { className: "cc-history-dots" }, single.points.map((point, index) => /* @__PURE__ */ React.createElement(
            "circle",
            {
              key: index,
              cx: xFor(point.t),
              cy: yFor(point.v),
              r: "1.7",
              fill: single.color,
              opacity: "0.85"
            }
          ))) : null,
          single && single.points.length ? /* @__PURE__ */ React.createElement("g", { className: "cc-history-latest" }, /* @__PURE__ */ React.createElement(
            "circle",
            {
              cx: xFor(single.points[single.points.length - 1].t),
              cy: yFor(single.points[single.points.length - 1].v),
              r: "7",
              fill: "none",
              stroke: single.color,
              strokeWidth: "1.3"
            }
          ), /* @__PURE__ */ React.createElement(
            "circle",
            {
              cx: xFor(single.points[single.points.length - 1].t),
              cy: yFor(single.points[single.points.length - 1].v),
              r: "3",
              fill: single.color,
              stroke: "#0a1424",
              strokeWidth: "1.2"
            }
          )) : null,
          single ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
            "circle",
            {
              cx: xFor(single.points[peakIndex].t),
              cy: yFor(single.points[peakIndex].v),
              r: "3.5",
              fill: "#ff3b30",
              stroke: "#0a1424",
              strokeWidth: "1.4"
            },
            /* @__PURE__ */ React.createElement("title", null, `Peak ${single.points[peakIndex].v.toFixed(1)}% \xB7 ${formatTooltipTime(
        single.points[peakIndex].t
      )}`)
          ), /* @__PURE__ */ React.createElement(
            "circle",
            {
              cx: xFor(single.points[lowIndex].t),
              cy: yFor(single.points[lowIndex].v),
              r: "3.5",
              fill: "#00d47e",
              stroke: "#0a1424",
              strokeWidth: "1.4"
            },
            /* @__PURE__ */ React.createElement("title", null, `Low ${single.points[lowIndex].v.toFixed(1)}% \xB7 ${formatTooltipTime(
        single.points[lowIndex].t
      )}`)
          )) : null,
          hoveredT !== null && hoverIndex !== null ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
            "line",
            {
              x1: xFor(hoveredT),
              y1: margin.top,
              x2: xFor(hoveredT),
              y2: height - margin.bottom,
              stroke: "rgba(219,231,245,0.5)",
              strokeWidth: "1",
              strokeDasharray: "3 3"
            }
          ), series.map((s) => {
            const point = nearestPoint(s.points, hoveredT);
            return /* @__PURE__ */ React.createElement(
              "circle",
              {
                key: s.key,
                cx: xFor(point.t),
                cy: yFor(point.v),
                r: "3",
                fill: s.color,
                stroke: "#0a1424",
                strokeWidth: "1.2"
              }
            );
          })) : null,
          /* @__PURE__ */ React.createElement(
            "rect",
            {
              x: margin.left,
              y: margin.top,
              width: plotW,
              height: plotH,
              fill: "transparent",
              pointerEvents: "all",
              onMouseMove: (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                if (!rect.width) {
                  return;
                }
                const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                setHover(Math.round(fraction * (count - 1)));
              },
              onMouseLeave: () => setHover(null)
            }
          )
        ), hoveredT !== null && hoverIndex !== null ? /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "cc-history-tip",
            style: {
              left: `${Math.min(92, Math.max(8, xFor(hoveredT) / width * 100))}%`
            }
          },
          /* @__PURE__ */ React.createElement("div", { className: "cc-history-tip-time" }, formatTooltipTime(hoveredT)),
          series.map((s) => {
            const point = nearestPoint(s.points, hoveredT);
            return /* @__PURE__ */ React.createElement("div", { className: "cc-history-tip-row", key: s.key }, /* @__PURE__ */ React.createElement("i", { style: { background: s.color } }), /* @__PURE__ */ React.createElement("span", null, s.label), /* @__PURE__ */ React.createElement("b", null, point.v.toFixed(1), "%"));
          })
        ) : null);
      }
      function UsageTrack({ value, color, marker }) {
        return /* @__PURE__ */ React.createElement("div", { className: "cc-usage-track" }, /* @__PURE__ */ React.createElement("span", { style: { width: `${Math.max(0, Math.min(100, value))}%`, background: color } }), marker !== void 0 ? /* @__PURE__ */ React.createElement("i", { style: { left: `${Math.max(0, Math.min(100, marker))}%` }, title: `Fleet average ${marker.toFixed(1)}%` }) : null);
      }
      function Section({
        title,
        sub,
        className,
        children
      }) {
        return /* @__PURE__ */ React.createElement("div", { className: `cc-panel cc-detail-panel ${className || ""}` }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, title), sub ? /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, sub) : null), /* @__PURE__ */ React.createElement("div", { className: "cc-detail-panel-body" }, children));
      }
      function HostDetailModal({
        host,
        problems,
        fleet,
        source,
        inventoryHref,
        onClose
      }) {
        const [detail, setDetail] = useState(
          () => source === "sample" ? sampleHostDetail(host) : null
        );
        const [state, setState] = useState(
          source === "sample" ? "ready" : "loading"
        );
        const [historyTab, setHistoryTab] = useState(null);
        const [historyRange, setHistoryRange] = useState("24h");
        const [history, setHistory] = useState(null);
        const [historyState, setHistoryState] = useState(
          "idle"
        );
        const historyCache = useRef(/* @__PURE__ */ new Map());
        useEffect(() => {
          if (source === "sample") {
            setDetail(sampleHostDetail(host));
            setState("ready");
            return;
          }
          let cancelled = false;
          setDetail(null);
          setState("loading");
          fetchHostDetail(host).then((result) => {
            if (!cancelled) {
              setDetail(result);
              setState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setDetail(fallbackHostDetail(host, `Live detail unavailable: ${err.message}`));
              setState("error");
            }
          });
          return () => {
            cancelled = true;
          };
        }, [host.id, host.hostname, host.cpu, host.memory, host.disk, host.network, source]);
        useEffect(() => {
          historyCache.current.clear();
          setHistoryTab(null);
          setHistory(null);
          setHistoryState("idle");
        }, [host.id, host.hostname]);
        useEffect(() => {
          if (!historyTab) {
            return;
          }
          if (source === "sample") {
            setHistory(sampleHostHistory(host, historyRange));
            setHistoryState("ready");
            return;
          }
          const cached = historyCache.current.get(historyRange);
          if (cached) {
            setHistory(cached);
            setHistoryState("ready");
            return;
          }
          let cancelled = false;
          const now = Math.floor(Date.now() / 1e3);
          setHistory(null);
          setHistoryState("loading");
          fetchHostHistory(host, historyRange).then((result) => {
            if (!cancelled) {
              historyCache.current.set(historyRange, result);
              setHistory(result);
              setHistoryState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setHistoryState("error");
              setHistory({
                range: historyRange,
                from: now - HISTORY_RANGES[historyRange].seconds,
                to: now,
                series: {},
                filesystems: [],
                source: "live",
                partial: true,
                note: `Live history unavailable: ${err.message}`
              });
            }
          });
          return () => {
            cancelled = true;
          };
        }, [
          historyTab,
          historyRange,
          source,
          host.id,
          host.hostname,
          host.cpu,
          host.memory,
          host.disk,
          host.network
        ]);
        useEffect(() => {
          const onKey = (event) => {
            if (event.key === "Escape") {
              if (historyTab) {
                setHistoryTab(null);
              } else {
                onClose();
              }
            }
          };
          window.addEventListener("keydown", onKey);
          return () => window.removeEventListener("keydown", onKey);
        }, [onClose, historyTab]);
        useEffect(() => {
          const previous = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          return () => {
            document.body.style.overflow = previous;
          };
        }, []);
        const hostProblems = problems.filter((p) => p.hostname === host.hostname).slice().sort((a, b) => a.minutesAgo - b.minutesAgo);
        const filesystems = detail ? detail.filesystems : [];
        const healthColor = HEALTH_COLOR[host.health];
        const historyMeta = METRICS.find((metric) => metric.key === historyTab);
        const historyLabel = historyTab === "filesystems" ? "All filesystems" : historyMeta ? historyMeta.label : "";
        const chartSeries = [];
        if (history) {
          if (historyTab === "filesystems") {
            history.filesystems.forEach((fs, index) => {
              chartSeries.push({
                key: fs.mount,
                label: fs.mount,
                color: HISTORY_COLORS[index % HISTORY_COLORS.length],
                points: fs.points
              });
            });
          } else if (historyTab) {
            const points = history.series[historyTab];
            if (points && points.length && historyMeta) {
              chartSeries.push({
                key: historyTab,
                label: historyMeta.label.replace(" Utilisation", ""),
                color: historyMeta.accent,
                points
              });
            }
          }
        }
        const singleValues = chartSeries.length === 1 ? chartSeries[0].points.map((p) => p.v) : [];
        const singlePeak = singleValues.length ? Math.max(...singleValues) : 0;
        const singleLow = singleValues.length ? Math.min(...singleValues) : 0;
        const singleAvg = singleValues.length ? singleValues.reduce((sum, value) => sum + value, 0) / singleValues.length : 0;
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "cc-modal-backdrop",
            onMouseDown: (event) => {
              if (event.target === event.currentTarget) {
                onClose();
              }
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              className: "cc-modal",
              role: "dialog",
              "aria-modal": "true",
              "aria-labelledby": "cc-host-detail-title"
            },
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-aurora a1", "aria-hidden": "true" }),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-aurora a2", "aria-hidden": "true" }),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-beam", "aria-hidden": "true" }),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-modal-kicker" }, "SERVER STATISTICS", /* @__PURE__ */ React.createElement("span", { className: `cc-modal-source ${source}` }, source.toUpperCase())), /* @__PURE__ */ React.createElement("div", { className: "cc-modal-title", id: "cc-host-detail-title" }, host.hostname), /* @__PURE__ */ React.createElement("div", { className: "cc-modal-sub" }, host.environment, " \xB7 ", host.tier, " \xB7 ", host.hostGroup, " \xB7 ", host.os, " \xB7 ", host.businessService)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-modal-close", onClick: onClose, "aria-label": "Close server statistics" }, "\xD7")),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-body" }, historyTab ? /* @__PURE__ */ React.createElement("div", { className: "cc-history" }, /* @__PURE__ */ React.createElement("div", { className: "cc-history-head" }, /* @__PURE__ */ React.createElement(
              "button",
              {
                type: "button",
                className: "cc-history-back",
                onClick: () => setHistoryTab(null)
              },
              "\u2190 Overview"
            ), /* @__PURE__ */ React.createElement("div", { className: "cc-history-heading" }, /* @__PURE__ */ React.createElement("div", { className: "cc-history-title" }, historyLabel, " history"), /* @__PURE__ */ React.createElement("div", { className: "cc-history-sub" }, HISTORY_RANGES[historyRange].full, historyState === "loading" ? " \xB7 loading from Zabbix\u2026" : history && history.source === "sample" ? " \xB7 sample dataset" : " \xB7 point-to-point samples")), /* @__PURE__ */ React.createElement("div", { className: "cc-history-ranges", role: "group", "aria-label": "History time range" }, HISTORY_RANGE_KEYS.map((key) => /* @__PURE__ */ React.createElement(
              "button",
              {
                type: "button",
                key,
                className: `cc-history-range${key === historyRange ? " active" : ""}`,
                "aria-pressed": key === historyRange,
                onClick: () => setHistoryRange(key)
              },
              HISTORY_RANGES[key].label
            )))), /* @__PURE__ */ React.createElement("div", { className: "cc-history-tabs", role: "tablist", "aria-label": "History metric" }, HISTORY_TABS.map((tab) => /* @__PURE__ */ React.createElement(
              "button",
              {
                type: "button",
                role: "tab",
                key: tab.key,
                "aria-selected": historyTab === tab.key,
                className: `cc-history-tab${historyTab === tab.key ? " active" : ""}`,
                onClick: () => setHistoryTab(tab.key)
              },
              /* @__PURE__ */ React.createElement("i", { style: { background: tab.color } }),
              tab.label
            ))), /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-history-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-history-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-history-panel-title" }, historyTab === "filesystems" ? "Filesystem utilisation" : `${historyLabel.replace(" Utilisation", "")} utilisation`), /* @__PURE__ */ React.createElement("div", { className: "cc-history-panel-sub" }, HISTORY_RANGES[historyRange].full, " \xB7 0\u2013100% scale")), singleValues.length ? /* @__PURE__ */ React.createElement("div", { className: "cc-history-stats" }, /* @__PURE__ */ React.createElement("span", { className: "peak" }, "peak ", /* @__PURE__ */ React.createElement("b", null, singlePeak.toFixed(1), "%")), /* @__PURE__ */ React.createElement("span", { className: "low" }, "low ", /* @__PURE__ */ React.createElement("b", null, singleLow.toFixed(1), "%")), /* @__PURE__ */ React.createElement("span", null, "avg ", /* @__PURE__ */ React.createElement("b", null, singleAvg.toFixed(1), "%"))) : chartSeries.length ? /* @__PURE__ */ React.createElement("div", { className: "cc-history-stats" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, chartSeries.length), " series")) : null), historyState === "loading" && !history ? /* @__PURE__ */ React.createElement("div", { className: "cc-history-loading" }, "Loading ", HISTORY_RANGES[historyRange].full, " from Zabbix\u2026") : /* @__PURE__ */ React.createElement(
              HistoryChart,
              {
                key: `${historyTab}-${historyRange}`,
                series: chartSeries,
                from: history ? history.from : 0,
                to: history ? history.to : 0,
                range: historyRange
              }
            ), chartSeries.length > 1 ? /* @__PURE__ */ React.createElement("div", { className: "cc-history-legend" }, chartSeries.map((s) => {
              const latest = s.points[s.points.length - 1];
              return /* @__PURE__ */ React.createElement("span", { key: s.key }, /* @__PURE__ */ React.createElement("i", { style: { background: s.color } }), s.label, latest ? /* @__PURE__ */ React.createElement("b", { style: { color: BAND_COLOR(latest.v) } }, latest.v.toFixed(0), "%") : null);
            })) : null, history ? /* @__PURE__ */ React.createElement("div", { className: "cc-history-note" }, history.note) : null)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "cc-metric-grid" }, METRICS.map((metric) => {
              const value = host[metric.key];
              const trend = detail ? detail.trends[metric.key] : void 0;
              const hasTrend = !!trend && trend.length > 1;
              const peak = hasTrend ? Math.max(...trend) : 0;
              const low = hasTrend ? Math.min(...trend) : 0;
              return /* @__PURE__ */ React.createElement(
                "div",
                {
                  className: "cc-metric-card cc-metric-click",
                  key: metric.key,
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `Open ${metric.label} history`,
                  onClick: () => setHistoryTab(metric.key),
                  onKeyDown: (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setHistoryTab(metric.key);
                    }
                  }
                },
                /* @__PURE__ */ React.createElement("span", { className: "cc-metric-open", "aria-hidden": "true" }, "history \u2197"),
                /* @__PURE__ */ React.createElement(Gauge, { value, color: BAND_COLOR(value) }),
                /* @__PURE__ */ React.createElement("div", { className: "cc-metric-info" }, /* @__PURE__ */ React.createElement("div", { className: "cc-metric-name" }, metric.label), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-band", style: { color: BAND_COLOR(value) } }, BAND_LABEL(value)), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-fleet" }, "Fleet avg ", fleet[metric.key].toFixed(1), "%")),
                /* @__PURE__ */ React.createElement(Sparkline, { values: trend, color: metric.accent }),
                /* @__PURE__ */ React.createElement("div", { className: "cc-metric-foot" }, hasTrend ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "cc-metric-range" }, /* @__PURE__ */ React.createElement("b", { className: "peak" }, "peak ", peak.toFixed(0), "%"), /* @__PURE__ */ React.createElement("em", null, "\xB7"), /* @__PURE__ */ React.createElement("b", { className: "low" }, "low ", low.toFixed(0), "%")), /* @__PURE__ */ React.createElement("span", null, "last 24 h")) : /* @__PURE__ */ React.createElement("span", null, "current snapshot"))
              );
            })), /* @__PURE__ */ React.createElement("div", { className: "cc-detail-grid" }, /* @__PURE__ */ React.createElement(
              Section,
              {
                title: "Filesystem usage",
                sub: filesystems.length ? `${filesystems.length} filesystem${filesystems.length === 1 ? "" : "s"}` : void 0
              },
              !detail ? /* @__PURE__ */ React.createElement("div", { className: "cc-detail-empty" }, "Loading filesystem data from Zabbix\u2026") : /* @__PURE__ */ React.createElement("div", { className: "cc-fs-list" }, filesystems.map((fs) => /* @__PURE__ */ React.createElement("div", { className: "cc-fs-row", key: fs.mount }, /* @__PURE__ */ React.createElement("span", { className: "cc-fs-mount", title: fs.mount }, fs.mount), /* @__PURE__ */ React.createElement(UsageTrack, { value: fs.used, color: BAND_COLOR(fs.used) }), /* @__PURE__ */ React.createElement("span", { className: "cc-fs-value", style: { color: BAND_COLOR(fs.used) } }, fs.used.toFixed(0), "%"))), /* @__PURE__ */ React.createElement("div", { className: "cc-fs-legend" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#00d47e" } }), " < 70%"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#ffc107" } }), " 70\u201390%"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#ff3b30" } }), " \u2265 90%")), /* @__PURE__ */ React.createElement(
                "button",
                {
                  type: "button",
                  className: "cc-fs-history",
                  onClick: () => setHistoryTab("filesystems")
                },
                "View filesystem history \u2192"
              ))
            ), /* @__PURE__ */ React.createElement(Section, { title: "This host vs fleet", sub: `${fleet.hosts} server${fleet.hosts === 1 ? "" : "s"} in view` }, /* @__PURE__ */ React.createElement("div", { className: "cc-cmp-list" }, METRICS.map((metric) => /* @__PURE__ */ React.createElement("div", { className: "cc-cmp-row", key: metric.key }, /* @__PURE__ */ React.createElement("div", { className: "cc-cmp-top" }, /* @__PURE__ */ React.createElement("span", null, metric.label.replace(" Utilisation", "")), /* @__PURE__ */ React.createElement("span", { className: "cc-muted" }, "host ", host[metric.key].toFixed(1), "% \xB7 fleet ", fleet[metric.key].toFixed(1), "%")), /* @__PURE__ */ React.createElement(
              UsageTrack,
              {
                value: host[metric.key],
                color: metric.accent,
                marker: fleet[metric.key]
              }
            ))), /* @__PURE__ */ React.createElement("div", { className: "cc-cmp-legend" }, "Bar = this host \xB7 tick = fleet average"))), /* @__PURE__ */ React.createElement(Section, { title: "Host facts" }, /* @__PURE__ */ React.createElement("dl", { className: "cc-facts" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Health"), /* @__PURE__ */ React.createElement("dd", null, /* @__PURE__ */ React.createElement("span", { className: "cc-modal-health", style: { color: healthColor, borderColor: healthColor } }, host.health))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Connectivity"), /* @__PURE__ */ React.createElement("dd", null, host.connectivity)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Data state"), /* @__PURE__ */ React.createElement("dd", null, host.dataState)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Last seen"), /* @__PURE__ */ React.createElement("dd", null, host.lastSeenMin >= 9999 ? "never / not monitored" : `${host.lastSeenMin} min ago`)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Maintenance"), /* @__PURE__ */ React.createElement("dd", null, host.maintenance ? "in maintenance" : "no")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "DR role"), /* @__PURE__ */ React.createElement("dd", null, host.drRole)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Active problems"), /* @__PURE__ */ React.createElement("dd", null, hostProblems.length)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, "Zabbix host id"), /* @__PURE__ */ React.createElement("dd", null, host.id))))), /* @__PURE__ */ React.createElement(
              Section,
              {
                title: "Active problems on this server",
                sub: `${hostProblems.length} problem${hostProblems.length === 1 ? "" : "s"}`
              },
              hostProblems.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cc-detail-empty" }, "No active problems for this host.") : /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-detail-problems" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Severity"), /* @__PURE__ */ React.createElement("th", null, "Problem"), /* @__PURE__ */ React.createElement("th", null, "Current"), /* @__PURE__ */ React.createElement("th", null, "Age"), /* @__PURE__ */ React.createElement("th", null, "Ack"))), /* @__PURE__ */ React.createElement("tbody", null, hostProblems.map((problem) => /* @__PURE__ */ React.createElement("tr", { key: problem.id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: `cc-sev cc-sev-${problem.severity.toLowerCase()}` }, problem.severity)), /* @__PURE__ */ React.createElement("td", { className: "cc-detail-problem-name" }, problem.problem), /* @__PURE__ */ React.createElement("td", null, problem.currentValue || "\u2014"), /* @__PURE__ */ React.createElement("td", null, problem.duration), /* @__PURE__ */ React.createElement("td", { className: problem.ack ? "cc-ack-yes" : "cc-ack-no" }, problem.ack ? "Yes" : "No"))))))
            ))),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-foot" }, /* @__PURE__ */ React.createElement(
              "span",
              {
                className: `cc-detail-note ${state === "error" || historyState === "error" ? "error" : !historyTab && detail && detail.partial || historyTab && history && history.partial ? "partial" : ""}`
              },
              historyTab ? historyState === "loading" ? "Loading history from Zabbix\u2026" : history ? history.note : "" : detail ? detail.note : state === "loading" ? "Loading live details from Zabbix\u2026" : ""
            ), inventoryHref ? /* @__PURE__ */ React.createElement("a", { className: "cc-modal-link", href: inventoryHref }, "Open in server inventory \u2192") : null)
          )
        );
      }

      const SERVICE_SLUG = {
        "Core Banking": "core-bank",
        "Payment Gateway": "pay-batch",
        "Internet Banking": "web-portal",
        Treasury: "treasury",
        "Customer Information": "cust-info",
        "HR & Finance": "hr-fin",
        "Other Services": "app-srv"
      };
      const OS_POOL = [
        ["RHEL", 62],
        ["Windows", 20],
        ["Solaris", 10],
        ["AS400", 8]
      ];
      const CRITICAL_PROBLEMS = [
        { text: "Disk space is low on /data", threshold: "> 90%" },
        { text: "CPU utilization is too high", threshold: "> 90%" },
        { text: "Memory utilization is too high", threshold: "> 90%" },
        { text: "Filesystem /var is full", threshold: "> 90%" },
        { text: "Service MSSQL is down", threshold: "= 1" },
        { text: "Host is unreachable", threshold: "= 1" },
        { text: "Storage replication lag exceeds threshold", threshold: "> 15m" },
        { text: "DR readiness check failed", threshold: "= Healthy" }
      ];
      const WARNING_PROBLEMS = [
        { text: "CPU load is high", threshold: "> 5" },
        { text: "Memory utilization is high", threshold: "> 80%" },
        { text: "Filesystem /tmp usage is high", threshold: "> 80%" },
        { text: "Replication lag is elevated", threshold: "> 2m" },
        { text: "Agent availability is stale", threshold: "> 5m" },
        { text: "Network errors on eth0", threshold: "> 10" },
        { text: "Swap utilization is high", threshold: "> 50%" }
      ];
      const INFO_PROBLEMS = [
        "Configuration changed",
        "Agent restarted",
        "New host discovered",
        "Maintenance window started",
        "SLA report generated",
        "Template re-linked",
        "Inventory updated"
      ];
      const RELATED = [
        "related (same storage)",
        "related (same host group)",
        "3 related (same cluster)",
        "affected (same LB)",
        "related (same filesystem)",
        "6 related (DR cluster)",
        "related (same service)",
        "12 affected (same network)",
        "2 related (same hypervisor)"
      ];
      const ENV_SPECS = [
        {
          env: "PROD",
          group: "Production",
          tiers: [
            ["Tier 1", 182],
            ["Tier 2", 214],
            ["Tier 3", 186]
          ],
          services: [
            ["Core Banking", 200],
            ["Payment Gateway", 128],
            ["Internet Banking", 80],
            ["Treasury", 86],
            ["Customer Information", 60],
            ["Other Services", 28]
          ],
          flags: { unavailable: 8, maintenance: 12, stale: 8, warning: 13, critical: 15 },
          dataStates: { notMonitored: 5, noData: 8, stale: 16 },
          cpu: { critical: 18, warning: 60 },
          memory: { critical: 114, warning: 365 },
          disk: { critical: 513, warning: 55 },
          network: { critical: 20, warning: 63 }
        },
        {
          env: "DR",
          group: "Disaster Recovery",
          tiers: [
            ["Tier 1", 120],
            ["Tier 2", 126],
            ["Tier 3", 122]
          ],
          services: [
            ["Core Banking", 102],
            ["Internet Banking", 62],
            ["Customer Information", 36],
            ["Other Services", 168]
          ],
          flags: { unavailable: 6, maintenance: 8, stale: 5, warning: 8, critical: 10 },
          dataStates: { notMonitored: 3, noData: 5, stale: 10 },
          cpu: { critical: 12, warning: 36 },
          memory: { critical: 72, warning: 231 },
          disk: { critical: 324, warning: 35 },
          network: { critical: 13, warning: 40 }
        },
        {
          env: "UAT",
          group: "Development / UAT",
          tiers: [
            ["Tier 1", 96],
            ["Tier 2", 102],
            ["Tier 3", 120]
          ],
          services: [
            ["HR & Finance", 74],
            ["Other Services", 244]
          ],
          flags: { unavailable: 4, maintenance: 5, stale: 3, warning: 6, critical: 6 },
          dataStates: { notMonitored: 2, noData: 3, stale: 6 },
          cpu: { critical: 8, warning: 28 },
          memory: { critical: 62, warning: 200 },
          disk: { critical: 281, warning: 30 },
          network: { critical: 11, warning: 35 }
        }
      ];
      function pad(n) {
        return n < 10 ? `0${n}` : String(n);
      }
      function formatTime(minutesAgo) {
        const d = new Date(Date.now() - minutesAgo * 6e4);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
      function durationLabel$1(minutes) {
        const m = Math.max(1, Math.round(minutes));
        if (m < 60) {
          return `${m}m`;
        }
        return `${Math.floor(m / 60)}h ${m % 60}m`;
      }
      function trend(base, seed) {
        let s = seed;
        const r = () => {
          s |= 0;
          s = s + 1831565813 | 0;
          let t = Math.imul(s ^ s >>> 15, 1 | s);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
        return Array.from(
          { length: 24 },
          (_, i) => Math.max(0, Math.min(100, Math.round(base + Math.sin(i / 2.8) * 5 + (r() - 0.5) * 9)))
        );
      }
      function makeTopServers(hosts) {
        return hosts.slice().sort((a, b) => Math.max(b.cpu, b.memory, b.disk) - Math.max(a.cpu, a.memory, a.disk)).slice(0, 10).map((host, i) => ({
          rank: i + 1,
          hostname: host.hostname,
          environment: host.environment,
          tier: host.tier,
          os: host.os,
          businessService: host.businessService,
          cpu: host.cpu,
          memory: host.memory,
          disk: host.disk,
          trends: {
            cpu: trend(host.cpu, 100 + i),
            memory: trend(host.memory, 200 + i),
            disk: trend(host.disk, 300 + i)
          }
        }));
      }
      function emptySampleData() {
        const zero = { avg: 0, critical: 0, warning: 0, normal: 0 };
        return {
          hosts: [],
          problems: [],
          businessServices: [],
          drComponents: [],
          topServers: [],
          utilization: { cpu: zero, memory: zero, disk: zero, network: zero },
          kpiDeltas: { available: "", unavailable: "", warning: "", critical: "" }
        };
      }
      function buildSampleData() {
        let seed = 12648430;
        const rnd = () => {
          seed |= 0;
          seed = seed + 1831565813 | 0;
          let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
        const rand = (min, max) => min + rnd() * (max - min);
        const randInt = (min, max) => Math.floor(rand(min, max + 1));
        const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
        const shuffle = (arr) => {
          const out = arr.slice();
          for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(rnd() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
          }
          return out;
        };
        const pickOs = () => {
          const total = OS_POOL.reduce((sum, [, w]) => sum + w, 0);
          let n = rnd() * total;
          for (const [name, weight] of OS_POOL) {
            n -= weight;
            if (n <= 0) {
              return name;
            }
          }
          return OS_POOL[0][0];
        };
        const hosts = [];
        let hostId = 1;
        const assignMetric = (envHosts, key, counts, ranges) => {
          const idx = shuffle(envHosts.map((_, i) => i));
          let p = 0;
          for (let i = 0; i < counts.critical; i++) {
            envHosts[idx[p++]][key] = randInt(ranges.critical[0], ranges.critical[1]);
          }
          for (let i = 0; i < counts.warning; i++) {
            envHosts[idx[p++]][key] = randInt(ranges.warning[0], ranges.warning[1]);
          }
          while (p < idx.length) {
            envHosts[idx[p++]][key] = randInt(ranges.normal[0], ranges.normal[1]);
          }
        };
        for (const spec of ENV_SPECS) {
          const envHosts = [];
          const servicePool = [];
          for (const [service, count] of spec.services) {
            for (let i = 0; i < count; i++) {
              servicePool.push(service);
            }
          }
          const shuffledServices = shuffle(servicePool);
          let serviceIdx = 0;
          const nameCounters = {};
          for (const [tier, count] of spec.tiers) {
            for (let i = 0; i < count; i++) {
              const service = shuffledServices[serviceIdx++] ?? "Other Services";
              const slug = SERVICE_SLUG[service] ?? "app-srv";
              nameCounters[slug] = (nameCounters[slug] ?? 0) + 1;
              const prefix = spec.env === "PROD" ? "" : spec.env === "DR" ? "dr-" : "uat-";
              const hostname = `${prefix}${slug}-${pad(nameCounters[slug])}`;
              envHosts.push({
                id: hostId++,
                hostname,
                environment: spec.env,
                hostGroup: spec.group,
                tier,
                os: pickOs(),
                businessService: service,
                health: "healthy",
                connectivity: "available",
                severity: null,
                maintenance: false,
                stale: false,
                lastSeenMin: 0,
                dataState: "upToDate",
                drRole: spec.env === "PROD" ? "Primary" : spec.env === "DR" ? "DR" : "N/A",
                cpu: 0,
                memory: 0,
                disk: 0,
                network: 0
              });
            }
          }
          const flagIdx = shuffle(envHosts.map((_, i) => i));
          let fi = 0;
          for (let i = 0; i < spec.flags.unavailable; i++) {
            envHosts[flagIdx[fi++]].connectivity = "unavailable";
          }
          for (let i = 0; i < spec.flags.maintenance; i++) {
            envHosts[flagIdx[fi++]].maintenance = true;
          }
          for (let i = 0; i < spec.flags.stale; i++) {
            envHosts[flagIdx[fi++]].stale = true;
          }
          for (let i = 0; i < spec.flags.warning; i++) {
            envHosts[flagIdx[fi++]].severity = "warning";
          }
          for (let i = 0; i < spec.flags.critical; i++) {
            envHosts[flagIdx[fi++]].severity = "critical";
          }
          for (const h of envHosts) {
            h.health = h.maintenance ? "maintenance" : h.connectivity === "unavailable" ? "unavailable" : h.stale ? "stale" : h.severity === "critical" ? "critical" : h.severity === "warning" ? "warning" : "healthy";
          }
          const unavailablePool = shuffle(envHosts.filter((h) => h.connectivity === "unavailable"));
          for (let i = 0; i < spec.dataStates.notMonitored; i++) {
            if (unavailablePool[i]) {
              unavailablePool[i].dataState = "notMonitored";
            }
          }
          const remainingPool = shuffle(envHosts.filter((h) => h.dataState === "upToDate"));
          let ri = 0;
          for (let i = 0; i < spec.dataStates.noData; i++) {
            if (remainingPool[ri]) {
              remainingPool[ri++].dataState = "noData";
            }
          }
          for (let i = 0; i < spec.dataStates.stale; i++) {
            if (remainingPool[ri]) {
              remainingPool[ri++].dataState = "stale";
            }
          }
          for (const h of envHosts) {
            h.lastSeenMin = h.dataState === "notMonitored" ? randInt(30, 120) : h.dataState === "noData" ? randInt(11, 25) : h.dataState === "stale" ? randInt(5, 10) : randInt(0, 4);
          }
          assignMetric(envHosts, "cpu", spec.cpu, {
            critical: [90, 99],
            warning: [70, 89],
            normal: [5, 55]
          });
          assignMetric(envHosts, "memory", spec.memory, {
            critical: [90, 99],
            warning: [70, 89],
            normal: [40, 69]
          });
          assignMetric(envHosts, "disk", spec.disk, {
            critical: [94, 99],
            warning: [70, 89],
            normal: [45, 69]
          });
          assignMetric(envHosts, "network", spec.network, {
            critical: [90, 99],
            warning: [70, 89],
            normal: [48, 69]
          });
          hosts.push(...envHosts);
        }
        const problems = [];
        let problemId = 1;
        const criticalHosts = hosts.filter((h) => h.severity === "critical");
        const warningHosts = hosts.filter((h) => h.severity === "warning");
        const infoHosts = shuffle(hosts.slice()).slice(0, 18);
        const slaFor = () => {
          const n = rnd();
          return n < 0.6 ? "Within SLA" : n < 0.85 ? "At Risk" : "Breaching";
        };
        criticalHosts.forEach((h, i) => {
          const template = pick(CRITICAL_PROBLEMS);
          const breaching = [];
          if (h.cpu >= 90) {
            breaching.push({ text: "CPU utilization is too high", value: h.cpu });
          }
          if (h.memory >= 90) {
            breaching.push({ text: "Memory utilization is too high", value: h.memory });
          }
          if (h.disk >= 90) {
            breaching.push({ text: "Filesystem /var is full", value: h.disk });
          }
          const chosen = breaching.length > 0 ? pick(breaching) : null;
          let problem = chosen ? chosen.text : template.text;
          let current = chosen ? `${chosen.value}%` : `${Math.max(h.cpu, h.memory, h.disk)}%`;
          let threshold = chosen ? "> 90%" : template.threshold;
          const minutesAgo = randInt(1, 120);
          problems.push({
            id: problemId++,
            time: formatTime(minutesAgo),
            minutesAgo,
            severity: i < 21 ? "Critical" : "High",
            severityGroup: "Critical",
            hostname: h.hostname,
            environment: h.environment,
            tier: h.tier,
            businessService: h.businessService,
            problem,
            currentValue: current,
            threshold,
            duration: durationLabel$1(minutesAgo),
            sla: slaFor(),
            ack: true,
            maintenance: false,
            related: pick(RELATED)
          });
        });
        warningHosts.forEach((h) => {
          const template = pick(WARNING_PROBLEMS);
          const minutesAgo = randInt(3, 180);
          const current = template.text.includes("load") ? rand(4.5, 8.5).toFixed(1) : template.text.includes("Replication") ? `${randInt(2, 14)}m` : template.text.includes("errors") ? String(randInt(12, 80)) : `${randInt(70, 89)}%`;
          problems.push({
            id: problemId++,
            time: formatTime(minutesAgo),
            minutesAgo,
            severity: "Warning",
            severityGroup: "Warning",
            hostname: h.hostname,
            environment: h.environment,
            tier: h.tier,
            businessService: h.businessService,
            problem: template.text,
            currentValue: current,
            threshold: template.threshold,
            duration: durationLabel$1(minutesAgo),
            sla: slaFor(),
            ack: true,
            maintenance: false,
            related: pick(RELATED)
          });
        });
        infoHosts.forEach((h) => {
          const minutesAgo = randInt(5, 600);
          problems.push({
            id: problemId++,
            time: formatTime(minutesAgo),
            minutesAgo,
            severity: "Info",
            severityGroup: "Info",
            hostname: h.hostname,
            environment: h.environment,
            tier: h.tier,
            businessService: h.businessService,
            problem: pick(INFO_PROBLEMS),
            currentValue: "-",
            threshold: "-",
            duration: durationLabel$1(minutesAgo),
            sla: "Within SLA",
            ack: true,
            maintenance: false,
            related: pick(RELATED)
          });
        });
        problems.sort((a, b) => a.minutesAgo - b.minutesAgo);
        const unackIdx = new Set(shuffle(problems.map((_, i) => i)).slice(0, 48));
        problems.forEach((p, i) => {
          p.ack = !unackIdx.has(i);
          p.maintenance = i % 9 === 0;
        });
        const businessServices = [
          { name: "Core Banking", env: "PROD/DR", servers: 302, status: "Critical", activeProblems: 8 },
          { name: "Payment Gateway", env: "PROD", servers: 128, status: "High", activeProblems: 6 },
          { name: "Internet Banking", env: "PROD/DR", servers: 142, status: "High", activeProblems: 4 },
          { name: "Treasury", env: "PROD", servers: 86, status: "Warning", activeProblems: 3 },
          { name: "Customer Information", env: "PROD/DR", servers: 96, status: "Warning", activeProblems: 4 },
          { name: "HR & Finance", env: "UAT", servers: 74, status: "Warning", activeProblems: 0 },
          { name: "Other Services", env: "Mixed", servers: 440, status: "Healthy", activeProblems: 2 }
        ];
        const drComponents = [
          {
            name: "Core Banking DB",
            prodStatus: "Healthy",
            drStatus: "Healthy",
            replicationLag: "12 sec",
            lastSync: "1m ago",
            hostFilter: { environment: "DR", businessService: "Core Banking" }
          },
          {
            name: "Application Servers",
            prodStatus: "Healthy",
            drStatus: "Healthy",
            replicationLag: "< 1 min",
            lastSync: "2m ago",
            hostFilter: { environment: "DR", tier: "Tier 1" }
          },
          {
            name: "File Services",
            prodStatus: "Warning",
            drStatus: "Healthy",
            replicationLag: "5 min",
            lastSync: "6m ago",
            hostFilter: { environment: "DR", os: "Windows" }
          },
          {
            name: "Backup Repository",
            prodStatus: "Healthy",
            drStatus: "Healthy",
            replicationLag: "-",
            lastSync: "3m ago",
            hostFilter: { environment: "DR", businessService: "Other Services" }
          },
          {
            name: "VM Replication (VMware)",
            prodStatus: "Healthy",
            drStatus: "Warning",
            replicationLag: "3 min",
            lastSync: "5m ago",
            hostFilter: { environment: "DR" }
          },
          {
            name: "Storage Replication",
            prodStatus: "Critical",
            drStatus: "Critical",
            replicationLag: "1h 24m",
            lastSync: "15m ago",
            hostFilter: { environment: "DR" }
          },
          {
            name: "DR Network Connectivity",
            prodStatus: "Healthy",
            drStatus: "Healthy",
            replicationLag: "-",
            lastSync: "1m ago",
            hostFilter: { environment: "DR" }
          }
        ];
        return {
          hosts,
          problems,
          businessServices,
          drComponents,
          topServers: makeTopServers(hosts),
          utilization: {
            cpu: { avg: 36, critical: 38, warning: 124, normal: 1106 },
            memory: { avg: 78, critical: 248, warning: 796, normal: 224 },
            disk: { avg: 94, critical: 1118, warning: 120, normal: 30 },
            network: { avg: 62, critical: 44, warning: 138, normal: 1086 }
          },
          kpiDeltas: {
            available: "\u25B2 +7 (24h)",
            unavailable: "\u25B2 +3 (24h)",
            warning: "\u25BC -5 (24h)",
            critical: "\u25B2 +6 (24h)"
          }
        };
      }
      function matchesFilters(host, filters) {
        return (filters.environment === "All" || host.environment === filters.environment) && (filters.tier === "All" || host.tier === filters.tier) && (filters.hostGroup === "All" || host.hostGroup === filters.hostGroup) && (filters.os === "All" || host.os === filters.os) && (filters.businessService === "All" || host.businessService === filters.businessService);
      }

      const CSS = `
/* \u2500\u2500 Magic UI design tokens \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.cc-app {
  --bg: #04080f;
  --panel: #0b1627;
  --panel-2: #0e1c31;
  --border: #14253c;
  --border-soft: rgba(20, 37, 60, 0.6);
  --ink: #dbe7f5;
  --ink-2: #9fb3cc;
  --muted: #7d92ad;
  --blue: #2f9bff;
  --cyan: #00d4ff;
  --purple: #8b5cf6;
  --green: #00d47e;
  --amber: #ffc107;
  --orange: #ff8a3d;
  --red: #ff4d67;
  --surface: #0a1526;

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  margin: 0;
  padding: 14px 18px 28px;
  overflow-x: hidden;
  background:
    radial-gradient(1100px 480px at 12% -12%, rgba(20, 70, 140, 0.24), transparent 62%),
    radial-gradient(900px 420px at 88% -6%, rgba(120, 60, 220, 0.14), transparent 60%),
    radial-gradient(760px 380px at 50% 108%, rgba(0, 140, 150, 0.1), transparent 65%),
    var(--bg);
  color: var(--ink);
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.cc-app *,
.cc-app *::before,
.cc-app *::after { box-sizing: border-box; }

/* Grafana sets a 1.5 line-height on body; without this reset it leaks into
   fixed-height selects/inputs and pushes their single line of text down into
   the bottom border. The concept build uses the browser default. */
.cc-app select,
.cc-app input,
.cc-app textarea {
  font-family: inherit;
  line-height: normal;
}

.cc-app::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(120, 170, 255, 0.1) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.7) 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.7) 55%, transparent 100%);
}

/* Lift page content above the aurora backdrop, but leave fixed overlays
   (the host-detail drawer) alone \u2014 this selector otherwise out-specifies
   their position: fixed and renders them inline at the bottom of the page. */
.cc-app > :not(.cc-aurora):not(.cc-modal-backdrop):not(style) {
  position: relative;
  z-index: 1;
}

/* Drifting aurora orbs (Magic UI backdrop). */
/* The orbs are already soft radial gradients. An animated element with a
   blur() filter forces the browser to re-rasterise the filter every frame; on
   an always-on wall display that exhausts the GPU process and the tab ends up
   blank after a while. Keep the soft gradient, drop the filter. */
.cc-aurora {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.55;
}

.cc-aurora.a1 {
  top: -180px;
  left: -160px;
  width: 700px;
  height: 420px;
  background: radial-gradient(circle, rgba(47, 155, 255, 0.36), transparent 65%);
  animation: cc-drift-a 19s ease-in-out infinite alternate;
}

.cc-aurora.a2 {
  top: 60px;
  right: -200px;
  width: 640px;
  height: 460px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 66%);
  animation: cc-drift-b 23s ease-in-out infinite alternate;
}

.cc-aurora.a3 {
  top: 520px;
  left: 38%;
  width: 560px;
  height: 380px;
  opacity: 0.35;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.18), transparent 68%);
  animation: cc-drift-a 27s ease-in-out infinite alternate-reverse;
}

/* \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px 22px;
  margin-bottom: 14px;
}

.cc-brand {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  min-width: 0;
}

.cc-logo {
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 11px;
  background: linear-gradient(145deg, rgba(47, 155, 255, 0.24), rgba(139, 92, 246, 0.14));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 26px -12px rgba(47, 155, 255, 0.8);
}

.cc-logo span {
  display: block;
  width: 100%;
  height: 3px;
  border-radius: 2px;
}

/* Configured logo: a wider, unpadded slot keeps the image inside the header
   line without distorting non-square artwork. */
.cc-logo.cc-logo-image {
  width: auto;
  min-width: 40px;
  max-width: 160px;
  padding: 2px 6px;
  background: rgba(8, 18, 33, 0.55);
}

.cc-logo-image img {
  display: block;
  max-width: 148px;
  max-height: 34px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(47, 155, 255, 0.35));
}

.cc-eyebrow {
  color: var(--muted);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  white-space: nowrap;
}

.cc-eyebrow span { opacity: 0.5; }

.cc-title {
  margin: 4px 0 5px;
  font-size: clamp(17px, 1.55vw, 22px);
  font-weight: 700;
  letter-spacing: 0.045em;
  line-height: 1.1;
  white-space: nowrap;
  background: linear-gradient(90deg, #9bd0ff 0%, #e8f4ff 24%, #c4b5fd 50%, #7fc4ff 76%, #9bd0ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: cc-title-shine 9s linear infinite;
}

.cc-subtitle {
  margin-top: 1px;
  color: var(--ink-2);
  font-size: 10.5px;
  letter-spacing: 0.02em;
}

/* \u2500\u2500 Header filters (collapsible, compact grid) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-header-filters {
  display: flex;
  flex: 1 1 520px;
  align-items: center;
  gap: 10px;
  align-self: center;
  min-width: 0;
  max-width: 640px;
  margin: 0 2px;
}

.cc-filter-toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid rgba(148, 184, 230, 0.26);
  border-radius: 7px;
  background: rgba(47, 155, 255, 0.1);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cc-filter-toggle:hover {
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.16);
  color: var(--ink);
}

.cc-filter-toggle:focus-visible {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-filter-caret {
  font-size: 10px;
  line-height: 1;
  transition: transform 0.18s ease;
}

.cc-header-filters.collapsed .cc-filter-caret { transform: rotate(-90deg); }

.cc-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  border-radius: 999px;
  background: rgba(47, 155, 255, 0.28);
  color: #d6ecff;
  font-size: 9px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.cc-filter-summary {
  display: none;
  max-width: 30vw;
  overflow: hidden;
  color: var(--muted);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-filter-summary[hidden] { display: none; }

.cc-header-filters.collapsed .cc-filter-summary { display: inline-block; }
.cc-header-filters.collapsed .cc-filter-controls { display: none; }

/* When collapsed, the group must shrink to just the toggle + active summary.
   Keeping the expanded flex-basis here steals the width the clock/Zabbix
   cluster needs and pushes it onto a second header row. */
.cc-header-filters.collapsed {
  flex: 0 0 auto;
  max-width: none;
}

.cc-filter-controls {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: 7px 9px;
  min-width: 0;
}

.cc-filter {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.cc-filter label {
  overflow: hidden;
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-transform: uppercase;
  margin: 0;
}

.cc-filter select {
  width: 100%;
  height: 26px;
  padding: 0 22px 0 8px;
  border: 1px solid rgba(148, 184, 230, 0.22);
  border-radius: 7px;
  outline: none;
  background-color: rgba(6, 12, 22, 0.85);
  background-image:
    linear-gradient(45deg, transparent 50%, rgba(219, 231, 245, 0.65) 50%),
    linear-gradient(135deg, rgba(219, 231, 245, 0.65) 50%, transparent 50%);
  background-position: calc(100% - 14px) 50%, calc(100% - 9px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  color: var(--ink);
  font-size: 10.5px;
  /* With appearance:none the single line of text is laid out in a line box;
     matching it to the 24px content height keeps the option text centred
     instead of sitting on the bottom border. */
  line-height: 24px;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.cc-filter select:hover { border-color: rgba(127, 196, 255, 0.4); }

.cc-filter select:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-filter select option { background: #0b1424; color: var(--ink); }

.cc-filter-reset {
  width: 100%;
  height: 26px;
  padding: 0 10px;
  border: 1px solid rgba(148, 184, 230, 0.24);
  border-radius: 6px;
  background: rgba(148, 184, 230, 0.08);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cc-filter-reset:hover {
  border-color: rgba(127, 196, 255, 0.45);
  background: rgba(47, 155, 255, 0.14);
  color: var(--ink);
}

.cc-filter-reset:focus-visible {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-header-filters.is-filtered .cc-filter-reset {
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.16);
  color: var(--ink);
}

/* \u2500\u2500 Header right cluster \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-header-right {
  display: flex;
  flex: none;
  align-items: flex-start;
  gap: 12px;
  margin-left: auto;
}

.cc-mode {
  display: flex;
  align-self: center;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.18);
  border-radius: 7px;
  background: rgba(10, 20, 36, 0.6);
}

.cc-mode button {
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 5px 9px;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.18s ease, background 0.18s ease;
}

.cc-mode button:hover { color: var(--ink); }
.cc-mode button.active { background: rgba(47, 155, 255, 0.22); color: #fff; }

.cc-mode .cc-mode-note {
  padding: 5px 9px;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: rgba(47, 155, 255, 0.16);
  color: #dfe9f6;
  white-space: nowrap;
}

.cc-clock { text-align: right; padding: 2px 2px; }

.cc-clock-date { color: var(--muted); font-size: 9px; letter-spacing: 0.04em; }

.cc-clock-time {
  margin-top: 1px;
  color: var(--ink);
  font-size: 19px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.cc-clock-zone { margin-left: 5px; color: var(--muted); font-size: 9px; font-weight: 400; }

.cc-zabbix {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 158px;
  padding: 7px 10px;
  border: 1px solid rgba(0, 212, 126, 0.24);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(9, 34, 25, 0.72), rgba(6, 20, 16, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-zabbix-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45);
  animation: cc-live-pulse 2.4s ease-out infinite;
}

.cc-zabbix-label { font-size: 11px; font-weight: 800; letter-spacing: 0.6px; color: #9ff3c5; }
.cc-zabbix-sub { margin-top: 1px; font-size: 8.5px; color: #6fbf94; }

.cc-sample-badge {
  margin-left: auto;
  padding: 1px 4px;
  border: 1px solid #5b4a14;
  border-radius: 3px;
  background: rgba(255, 193, 7, 0.08);
  color: var(--amber);
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.cc-sample-badge.is-live { color: var(--green); border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-sample-badge.is-error { color: var(--red); border-color: #5b1c26; background: rgba(255, 77, 103, 0.08); }

.cc-zabbix.is-error {
  border-color: #5b1c26;
  background: linear-gradient(180deg, rgba(52, 10, 16, 0.72), rgba(26, 6, 9, 0.72));
}

.cc-zabbix.is-error .cc-zabbix-dot { background: var(--red); box-shadow: 0 0 0 0 rgba(255, 77, 103, 0.45); animation-name: cc-live-pulse-red; }
.cc-zabbix.is-loading .cc-zabbix-dot { background: var(--amber); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45); animation-name: cc-live-pulse-amber; }
.cc-zabbix.is-sample .cc-zabbix-dot { background: var(--amber); box-shadow: none; animation: none; opacity: 0.85; }

/* \u2500\u2500 Banners \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-banner {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 10px;
  padding: 8px 11px;
  border: 1px solid #5b1c26;
  border-radius: 10px;
  background: rgba(255, 61, 87, 0.08);
  color: #ffb3bf;
  font-size: 10px;
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-banner strong { color: var(--red); font-weight: 800; }
.cc-banner.warn { border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); color: #ffe08a; }
.cc-banner.warn strong { color: var(--amber); }

.cc-banner-btn {
  margin-left: auto;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  color: #ffe08a;
  background: rgba(255, 193, 7, 0.12);
  border: 1px solid #5b4a14;
  border-radius: 5px;
  padding: 4px 9px;
  white-space: nowrap;
}

.cc-banner-btn:hover { background: rgba(255, 193, 7, 0.2); }

/* \u2500\u2500 Live problems ticker \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-ticker {
  display: flex;
  align-items: stretch;
  height: 44px;
  margin: 0 0 14px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 13px;
  background: rgba(10, 20, 36, 0.68);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-ticker-label {
  display: flex;
  flex: none;
  align-items: center;
  gap: 7px;
  padding: 0 16px;
  border-right: 1px solid rgba(255, 193, 7, 0.16);
  background: linear-gradient(90deg, rgba(255, 193, 7, 0.1), transparent);
  color: #ffd27a;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  white-space: nowrap;
}

.cc-live-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45);
  animation: cc-live-pulse 2.4s ease-out infinite;
}

.cc-live-dot.amber {
  background: var(--amber);
  box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45);
  animation-name: cc-live-pulse-amber;
}

.cc-ticker-viewport {
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
}

.cc-ticker-track {
  display: flex;
  width: max-content;
  animation: cc-marquee 80s linear infinite;
}

.cc-ticker:hover .cc-ticker-track { animation-play-state: paused; }

.cc-ticker-set {
  display: flex;
  align-items: center;
  gap: 34px;
  padding-right: 34px;
}

/* Blank sweep between loops of the problem list. A full viewport width of
   empty space means the next copy cannot appear until the current one has
   scrolled away, so a repeated list \u2014 especially a single repeated problem \u2014
   reads as a restart instead of a run-on row. */
.cc-ticker-gap {
  flex: 0 0 auto;
  width: 100vw;
}

.cc-ticker-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}

.cc-ticker-item b { color: var(--ink); font-weight: 600; }
.cc-ticker-item em { color: var(--muted); font-style: normal; font-variant-numeric: tabular-nums; }

/* Severity chip: the table renders severity as coloured text, but the ticker
   uses the concept's pill treatment with a leading status dot. */
.cc-ticker .cc-ticker-sev {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
}

.cc-ticker .cc-ticker-sev::before {
  content: '';
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.cc-ticker .cc-ticker-sev.cc-sev-critical {
  border-color: rgba(255, 77, 103, 0.24);
  background: rgba(255, 77, 103, 0.1);
  color: #ff8a9b;
}
.cc-ticker .cc-ticker-sev.cc-sev-critical::before { background: var(--red); }

.cc-ticker .cc-ticker-sev.cc-sev-high {
  border-color: rgba(255, 138, 61, 0.24);
  background: rgba(255, 138, 61, 0.1);
  color: #ffb07a;
}
.cc-ticker .cc-ticker-sev.cc-sev-high::before { background: var(--orange); }

.cc-ticker .cc-ticker-sev.cc-sev-warning {
  border-color: rgba(255, 193, 7, 0.24);
  background: rgba(255, 193, 7, 0.09);
  color: #ffd45e;
}
.cc-ticker .cc-ticker-sev.cc-sev-warning::before { background: var(--amber); }

.cc-ticker .cc-ticker-sev.cc-sev-info {
  border-color: rgba(47, 155, 255, 0.24);
  background: rgba(47, 155, 255, 0.1);
  color: #8ecbff;
}
.cc-ticker .cc-ticker-sev.cc-sev-info::before { background: var(--blue); }

/* \u2500\u2500 KPI row (MagicCard tiles) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-kpis {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-kpi {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-height: 60px;
  padding: 11px 11px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.78), rgba(7, 14, 26, 0.86));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(0, 80, 180, 0.9);
  /* No backdrop-filter: the panels are opaque enough without paying for a
     per-frame blur of the animated backdrop (see the aurora note above). */
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.cc-kpi > * { position: relative; z-index: 1; }

.cc-kpi::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(280px circle at 30% 0%, rgba(96, 165, 250, 0.13), transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-kpi:hover {
  transform: translateY(-1px);
  border-color: rgba(127, 196, 255, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 22px 60px -30px rgba(47, 155, 255, 0.75);
}

.cc-kpi:hover::after { opacity: 1; }

.cc-kpi-alert {
  border-color: rgba(255, 77, 103, 0.26);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(255, 61, 87, 0.6);
}

.cc-beam {
  position: absolute;
  inset: 0;
  z-index: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    transparent 0 68%,
    var(--red) 86%,
    #ffffff 92%,
    var(--red) 96%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  /* Static sheen: animating a conic-gradient's angle repaints the whole card
     border every frame, which is the other per-frame rasterisation cost. */
  pointer-events: none;
}

.cc-kpi-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 27px;
  height: 27px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: inset 0 0 16px rgba(47, 155, 255, 0.08);
  color: var(--tone);
}

.cc-kpi-body { min-width: 0; }

.cc-kpi-label {
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}

.cc-kpi-value {
  margin-top: 1px;
  color: var(--ink);
  font-size: clamp(19px, 1.55vw, 23px);
  font-weight: 700;
  line-height: 1.08;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  text-shadow: 0 0 22px rgba(127, 196, 255, 0.18);
}

/* Semantic counts: red = down/critical, amber = attention, green = healthy. */
.cc-kpi[data-tone="green"] .cc-kpi-value { color: var(--green); }
.cc-kpi[data-tone="red"] .cc-kpi-value { color: var(--red); }
.cc-kpi[data-tone="yellow"] .cc-kpi-value,
.cc-kpi[data-tone="orange"] .cc-kpi-value { color: var(--amber); }
.cc-kpi[data-tone="purple"] .cc-kpi-value { color: #fff; }
.cc-kpi[data-tone="gray"] .cc-kpi-value { color: var(--red); }
.cc-kpi[data-tone="cyan"] .cc-kpi-value { color: var(--blue); }

.cc-kpi-sub {
  overflow: hidden;
  margin-top: 2px;
  color: var(--ink-2);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-kpi-delta { margin-left: 3px; font-size: 8px; font-weight: 700; }
.cc-delta-up { color: var(--orange); }
.cc-delta-down { color: var(--green); }

.cc-kpi-link { color: inherit; text-decoration: none; cursor: pointer; }
.cc-kpi-link:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; }

.cc-kpi-link::before {
  content: "\u203A";
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 2;
  color: #5f83ad;
  font-size: 12px;
  line-height: 1;
  opacity: 0.6;
}

.cc-kpi-link:hover::before { color: #9cc9ff; opacity: 1; }

/* \u2500\u2500 Panels (glass cards) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-panel {
  position: relative;
  min-width: 0;
  padding: 13px 14px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.78), rgba(7, 14, 26, 0.86));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(0, 80, 180, 0.9);
  /* No backdrop-filter: the panels are opaque enough without paying for a
     per-frame blur of the animated backdrop (see the aurora note above). */
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.cc-panel > * { position: relative; z-index: 1; }

.cc-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(320px circle at 30% 0%, rgba(96, 165, 250, 0.1), transparent 68%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-panel:hover {
  border-color: rgba(127, 196, 255, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 22px 60px -30px rgba(47, 155, 255, 0.75);
}

.cc-panel:hover::after { opacity: 1; }

.cc-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 0;
  border: 0;
  background: none;
}

.cc-panel-title {
  color: var(--ink);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-panel-sub { margin-top: 2px; color: var(--muted); font-size: 8.5px; }

/* \u2500\u2500 Utilisation ring cards \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-util-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-util-body {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0;
  margin-top: 11px;
}

.cc-ring {
  --p: 0;
  --fill: var(--green);
  position: relative;
  flex: none;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: conic-gradient(var(--fill) calc(var(--p) * 1%), rgba(255, 255, 255, 0.07) 0);
  box-shadow: 0 0 24px -6px rgba(127, 196, 255, 0.35);
  transition: --p 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cc-ring::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: var(--surface);
}

.cc-ring-inner {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cc-ring-inner strong {
  color: var(--ink);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.cc-ring-inner span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.cc-util-right { flex: 1; min-width: 0; }

.cc-stackbar {
  display: flex;
  gap: 2px;
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.cc-seg { display: block; height: 100%; border-radius: 2px; transition: flex-grow 0.4s ease; }
.cc-seg:first-child { border-radius: 4px 2px 2px 4px; }
.cc-seg:last-child { border-radius: 2px 4px 4px 2px; }
.cc-seg.crit { background: var(--red); }
.cc-seg.warn { background: var(--amber); }
.cc-seg.ok { background: var(--green); }

.cc-legend { display: grid; gap: 4px; margin-top: 8px; }

.cc-legend-row {
  display: grid;
  grid-template-columns: 7px 1fr auto;
  gap: 6px;
  align-items: center;
  color: var(--ink-2);
  font-size: 8.5px;
}

.cc-legend-label { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.cc-legend-value { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.cc-dot { display: inline-block; width: 6px; height: 6px; border-radius: 2px; flex: 0 0 auto; }
.cc-dot.cc-dot-stale { background: transparent; box-shadow: inset 0 0 0 1.5px #8f9298; }

/* \u2500\u2500 Host group matrix \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-group { padding: 12px 14px; }

.cc-group-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  padding: 0;
}

.cc-group-name {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.cc-env-dot { display: inline-block; width: 7px; height: 7px; border-radius: 2px; flex: 0 0 auto; }
.cc-env-dot.prod { background: var(--blue); box-shadow: 0 0 10px rgba(47, 155, 255, 0.7); }
.cc-env-dot.dr { background: var(--purple); box-shadow: 0 0 10px rgba(139, 92, 246, 0.7); }
.cc-env-dot.uat { background: var(--cyan); box-shadow: 0 0 10px rgba(0, 212, 255, 0.6); }

.cc-group-total { color: var(--muted); font-size: 9px; font-weight: 500; letter-spacing: 0.02em; }

.cc-group-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 9px;
  color: var(--muted);
  font-size: 8px;
}

.cc-lg { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.cc-lg i { display: inline-block; width: 5px; height: 5px; border-radius: 1.5px; }
.cc-lg.ok i { background: var(--green); }
.cc-lg.warn i { background: var(--amber); }
.cc-lg.crit i { background: #ff3b30; }
.cc-lg.other i { background: #8f9298; }

.cc-grid-wrap { padding: 0; }

.cc-tier-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 7px 0;
  margin: 0;
  border-top: 1px dashed rgba(20, 37, 60, 0.75);
}

.cc-tier-row:nth-of-type(1) { border-top: 0; }

.cc-tier-label { width: auto; min-width: 0; padding-top: 1px; }

.cc-tier-title {
  color: var(--ink);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-tier-sub {
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-tier-counts { display: flex; gap: 4px; margin-top: 2px; }
.cc-tier-counts span { font-size: 7.5px; font-weight: 700; font-variant-numeric: tabular-nums; }

.cc-host-grid {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 2px;
  align-content: flex-start;
  min-height: 8px;
}

.cc-cell {
  position: relative;
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 1.5px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.cc-cell-btn { appearance: none; border: 0; padding: 0; font: inherit; cursor: pointer; }
.cc-cell-btn:hover { z-index: 5; transform: scale(2.6); box-shadow: 0 0 0 1px #fff, 0 0 10px 2px rgba(255, 255, 255, 0.35); }
.cc-cell-btn:focus-visible { outline: 2px solid #fff; outline-offset: 1px; z-index: 6; }

/* Solid, high-contrast fills: at 7px the diagonal stripe treatment blurred
   together and made stale / maintenance / unavailable indistinguishable. */
/* Health palette, tuned for 7px solid squares on the dark panel:
   critical is a true red (not pink), unavailable a clearly violet fuchsia,
   stale a neutral grey with no blue cast, maintenance a saturated azure. */
.cc-cell-healthy { background: rgba(0, 212, 126, 0.55); }
.cc-cell-warning { background: #ffc107; }
.cc-cell-critical { background: #ff3b30; box-shadow: 0 0 0 1px rgba(255, 59, 48, 0.4); }
/* Stale is hollow rather than filled: shape carries the state even when the
   grey and cyan read close at 7px on a blue-tinted panel. */
.cc-cell-stale { background: rgba(143, 146, 152, 0.1); box-shadow: inset 0 0 0 1.5px #8f9298; }
.cc-cell-maintenance { background: #22d3ee; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35); }
.cc-cell-unavailable { background: #a855f7; box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.5); }

.cc-cell-critical::after {
  content: "";
  position: absolute;
  inset: -1px;
  border: 1px solid rgba(255, 59, 48, 0.75);
  border-radius: inherit;
  pointer-events: none;
  animation: cc-cell-ring 2.4s ease-in-out infinite;
}

.cc-legend-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding: 7px 0 0;
  margin-top: 6px;
  border-top: 1px solid rgba(20, 37, 60, 0.6);
  color: var(--muted);
  font-size: 7.8px;
}

.cc-legend-inline span { display: inline-flex; align-items: center; gap: 4px; }

/* \u2500\u2500 Bottom row (3 panels) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-bottom {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-table-wrap { overflow-x: auto; }

.cc-table {
  width: 100%;
  margin-top: 9px;
  border-collapse: collapse;
  font-size: 9.5px;
}

.cc-table th {
  padding: 0 6px 5px 0;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-table td {
  padding: 5.5px 6px 5.5px 0;
  border-bottom: 1px solid var(--border-soft);
  color: var(--ink-2);
  white-space: nowrap;
  vertical-align: middle;
}

.cc-table tbody tr:last-child td { border-bottom: 0; }
.cc-table tbody tr:hover td { background: rgba(47, 155, 255, 0.05); }
.cc-table tr.cc-row-link { cursor: pointer; }
.cc-table tr.cc-row-link:hover td { background: rgba(47, 155, 255, 0.08); }
.cc-table tr.cc-row-link:focus-visible { outline: 2px solid var(--blue); outline-offset: -2px; }

.cc-row-anchor { display: inline-flex; align-items: center; gap: 4px; color: #e6f0fb; text-decoration: none; font-weight: 700; }
.cc-row-anchor:hover { color: #7fc4ff; text-decoration: underline; }

/* Hostnames open the per-server statistics drawer wherever they appear. */
.cc-host-link {
  appearance: none;
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
  font-weight: 700;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.cc-host-link:hover { color: #7fc4ff; text-decoration: underline; }
.cc-host-link:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 3px; }

.cc-ticker-host {
  appearance: none;
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
}
.cc-ticker-host:hover { color: #9bd0ff; text-decoration: underline; }
.cc-ticker-host:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; border-radius: 3px; }
.cc-row-arrow { color: #5f83ad; font-size: 11px; line-height: 1; }
.cc-row-link:hover .cc-row-arrow { color: #9cc9ff; }
.cc-table .num { text-align: right; font-variant-numeric: tabular-nums; }

.cc-status { font-weight: 800; font-size: 8.5px; }
.cc-status-critical { color: var(--red); }
.cc-status-high { color: var(--orange); }
.cc-status-warning { color: var(--amber); }
.cc-status-healthy { color: var(--green); }
.cc-muted { color: #6f86a3; }
.cc-strong { color: #e6f0fb; font-weight: 700; }

.cc-tabs {
  display: flex;
  flex: none;
  gap: 2px;
  padding: 2px;
  margin-top: 9px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 7px;
  background: rgba(10, 20, 36, 0.6);
}

.cc-tab {
  padding: 4px 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.cc-tab:hover { color: var(--ink); }
.cc-tab.active { color: var(--ink); background: rgba(47, 155, 255, 0.14); box-shadow: inset 0 0 0 1px rgba(47, 155, 255, 0.28); }

.cc-spark { display: block; width: 64px; height: 18px; }
.cc-bar-cell { display: flex; align-items: center; gap: 5px; }
.cc-mini-track { display: inline-block; width: 44px; height: 5px; overflow: hidden; border-radius: 3px; background: #12233a; }
.cc-mini-fill { display: block; height: 100%; border-radius: 3px; }

/* \u2500\u2500 Problems panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-problems { margin-bottom: 2px; }

.cc-problem-tabs {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 0 9px;
  border-bottom: 0;
}

.cc-problem-tabs .cc-spacer { flex: 1; }

.cc-problem-tabs .cc-tab {
  padding: 3px 9px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 999px;
  background: rgba(10, 20, 36, 0.5);
}

.cc-problem-tabs .cc-tab.active {
  border-color: rgba(47, 155, 255, 0.4);
  background: rgba(47, 155, 255, 0.16);
  box-shadow: none;
}

.cc-problem-scroll {
  max-height: 430px;
  overflow: auto;
  border-radius: 8px;
}

.cc-problem-scroll .cc-table-wrap { overflow: visible; }

.cc-problem-table { font-size: 8.8px; }
.cc-problem-table td { padding: 4px 6px; }

.cc-problem-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #0a1526;
  box-shadow: 0 1px 0 var(--border);
}

.cc-sev { font-weight: 800; text-transform: uppercase; font-size: 8px; letter-spacing: 0.2px; }
.cc-sev-critical { color: var(--red); }
.cc-sev-high { color: var(--orange); }
.cc-sev-warning { color: var(--amber); }
.cc-sev-info { color: var(--blue); }

.cc-duration { color: var(--amber); font-weight: 700; }
.cc-sla-within { color: var(--green); font-weight: 700; }
.cc-sla-risk { color: var(--amber); font-weight: 700; }
.cc-sla-breach { color: var(--red); font-weight: 700; }
.cc-ack-yes { color: var(--green); }
.cc-ack-no { color: var(--red); }
.cc-related { color: #7fc4ff; }

/* .cc-table td sets a base ink colour and out-specifies the semantic
   classes, so severity / SLA / ack cells rendered plain white. Re-assert
   them at cell specificity. */
.cc-table td.cc-sev-critical { color: var(--red); }
.cc-table td.cc-sev-high { color: var(--orange); }
.cc-table td.cc-sev-warning { color: var(--amber); }
.cc-table td.cc-sev-info { color: var(--blue); }
.cc-table td.cc-duration { color: var(--amber); }
.cc-table td.cc-sla-within { color: var(--green); }
.cc-table td.cc-sla-risk { color: var(--amber); }
.cc-table td.cc-sla-breach { color: var(--red); }
.cc-table td.cc-ack-yes { color: var(--green); }
.cc-table td.cc-ack-no { color: var(--red); }
.cc-table td.cc-related { color: #7fc4ff; }
.cc-table td.cc-muted { color: #6f86a3; }
.cc-table td.cc-strong { color: #e6f0fb; }

.cc-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 2px 0;
  color: #5f7591;
  font-size: 8px;
}

/* \u2500\u2500 Host detail drawer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 22px 16px;
  overflow-y: auto;
  /* Opaque overlay instead of a full-screen backdrop blur; the drawer still
     reads as a layer above the dashboard. */
  background: rgba(2, 7, 14, 0.88);
}

.cc-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(1000px, 100%);
  max-height: calc(100vh - 44px);
  margin: auto;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.96), rgba(7, 14, 26, 0.98));
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: cc-modal-in 0.15s ease-out;
  isolation: isolate;
}

/* Keep the drawer's content above the aurora blobs and border beam. */
.cc-modal > :not(.cc-modal-aurora):not(.cc-modal-beam) { position: relative; z-index: 1; }

.cc-modal-aurora {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
}

.cc-modal-aurora.a1 {
  top: -150px;
  left: -120px;
  width: 460px;
  height: 320px;
  background: radial-gradient(circle, rgba(47, 155, 255, 0.4), transparent 65%);
  animation: cc-drift-a 17s ease-in-out infinite alternate;
}

.cc-modal-aurora.a2 {
  top: 30px;
  right: -150px;
  width: 420px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.32), transparent 66%);
  animation: cc-drift-b 21s ease-in-out infinite alternate;
}

.cc-modal-beam {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1.5px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    transparent 0 58%,
    rgba(47, 155, 255, 0.95) 72%,
    #c4b5fd 83%,
    rgba(0, 212, 255, 0.95) 92%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.cc-modal-head {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px 12px;
  border-bottom: 1px solid rgba(27, 52, 81, 0.8);
  background: linear-gradient(90deg, rgba(24, 54, 88, 0.35), transparent);
}

.cc-modal-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cc-modal-source {
  padding: 2px 6px;
  border: 1px solid #1c4a36;
  border-radius: 3px;
  background: rgba(0, 230, 118, 0.08);
  color: var(--green);
  font-size: 7.5px;
  letter-spacing: 0.6px;
}

.cc-modal-source.sample { color: var(--amber); border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); }

.cc-modal-title {
  margin-top: 5px;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.02em;
  word-break: break-word;
  background: linear-gradient(90deg, #9bd0ff 0%, #e8f4ff 26%, #c4b5fd 52%, #7fc4ff 78%, #9bd0ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: cc-title-shine 9s linear infinite;
}

.cc-modal-sub { margin-top: 5px; color: var(--ink-2); font-size: 9.5px; }

.cc-modal-close {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 8px;
  background: rgba(10, 20, 36, 0.7);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.cc-modal-close:hover { color: #fff; border-color: rgba(127, 196, 255, 0.5); background: rgba(47, 155, 255, 0.12); }

.cc-modal-body { overflow-y: auto; padding: 13px 18px 16px; }

.cc-metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }

.cc-metric-card {
  position: relative;
  min-width: 0;
  padding: 9px 10px 7px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.14);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.7), rgba(7, 14, 26, 0.8));
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.cc-metric-card > * { position: relative; z-index: 1; }

.cc-metric-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(220px circle at 30% 0%, rgba(96, 165, 250, 0.16), transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-metric-card:hover {
  border-color: rgba(127, 196, 255, 0.32);
  box-shadow: 0 14px 40px -24px rgba(47, 155, 255, 0.8);
  transform: translateY(-1px);
}

.cc-metric-card:hover::after { opacity: 1; }

.cc-gauge-fill { animation: cc-gauge-draw 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both; }

.cc-spark-line {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: cc-spark-draw 1.3s ease 0.15s forwards;
}

.cc-usage-track > span {
  transform-origin: left center;
  animation: cc-usage-grow 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.cc-gauge { position: relative; width: 100%; max-width: 150px; margin: 0 auto; }
.cc-gauge svg { display: block; width: 100%; height: auto; }

.cc-gauge-center {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  text-align: center;
}

.cc-gauge-center strong { font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums; }
.cc-gauge-center span { font-size: 9px; color: var(--muted); }

.cc-metric-info { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.cc-metric-name { color: var(--ink); font-size: 8.5px; font-weight: 700; }
.cc-metric-band { margin-left: auto; font-size: 7.5px; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; }
.cc-metric-fleet { width: 100%; color: var(--muted); font-size: 8px; }
.cc-detail-spark { display: block; width: 100%; height: 38px; margin-top: 5px; }

.cc-detail-spark-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  margin-top: 5px;
  border-top: 1px dashed var(--border);
  color: #5f7591;
  font-size: 8px;
}

.cc-metric-foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
  margin-top: 3px;
  color: #5f7591;
  font-size: 7.5px;
}
.cc-metric-foot > span:last-child { margin-left: auto; }
.cc-metric-range { display: inline-flex; align-items: baseline; gap: 4px; white-space: nowrap; }
.cc-metric-range b { font-weight: 700; font-variant-numeric: tabular-nums; }
.cc-metric-range b.peak { color: #ff6b62; }
.cc-metric-range b.low { color: #00d47e; }
.cc-metric-range em { color: #3f5470; font-style: normal; }

.cc-detail-grid { display: grid; grid-template-columns: 1.08fr 1fr 0.86fr; gap: 9px; margin-bottom: 9px; }
.cc-detail-panel-body { padding: 2px 0 0; }

.cc-fs-list { display: flex; flex-direction: column; gap: 7px; }
.cc-fs-row { display: flex; align-items: center; gap: 7px; }

.cc-fs-mount {
  width: 52px;
  flex: 0 0 auto;
  overflow: hidden;
  color: var(--ink-2);
  font-size: 8.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-fs-value {
  width: 32px;
  flex: 0 0 auto;
  text-align: right;
  font-size: 8.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cc-usage-track { position: relative; flex: 1; height: 7px; overflow: hidden; border-radius: 4px; background: #12233a; }
.cc-usage-track > span { display: block; height: 100%; border-radius: 4px; }
.cc-usage-track > i { position: absolute; top: -2px; bottom: -2px; width: 1.5px; background: var(--ink); opacity: 0.7; }

.cc-fs-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; color: var(--muted); font-size: 7.5px; }
.cc-fs-legend span { display: inline-flex; align-items: center; gap: 4px; }
.cc-fs-legend i { display: inline-block; width: 6px; height: 6px; border-radius: 2px; }

.cc-fs-history {
  align-self: flex-start;
  margin-top: 2px;
  padding: 3px 0;
  border: 0;
  background: none;
  color: #7fb6ff;
  font-family: inherit;
  font-size: 8px;
  font-weight: 700;
  cursor: pointer;
}
.cc-fs-history:hover { color: #dbe7f5; }

/* Clickable metric cards open the historical view. */
.cc-metric-card.cc-metric-click { cursor: pointer; }
.cc-metric-card.cc-metric-click:focus-visible {
  outline: 2px solid rgba(127, 196, 255, 0.75);
  outline-offset: 2px;
}
.cc-metric-open {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 2;
  padding: 1px 5px;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 999px;
  background: rgba(8, 18, 33, 0.75);
  color: #8fb8e8;
  font-size: 6.8px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.75;
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  pointer-events: none;
}
.cc-metric-click:hover .cc-metric-open,
.cc-metric-click:focus-visible .cc-metric-open {
  opacity: 1;
  color: #dbe7f5;
  border-color: rgba(127, 196, 255, 0.55);
}

/* Historical view inside the Server Statistics drawer. */
.cc-history { display: flex; flex-direction: column; gap: 9px; }
.cc-history-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.cc-history-back {
  padding: 4px 9px;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 7px;
  background: rgba(8, 18, 33, 0.62);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.cc-history-back:hover {
  color: #fff;
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.12);
}
.cc-history-heading { flex: 1; min-width: 150px; }
.cc-history-title { color: var(--ink); font-size: 12.5px; font-weight: 800; letter-spacing: 0.2px; }
.cc-history-sub { margin-top: 2px; color: var(--muted); font-size: 8.5px; }

.cc-history-ranges {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 9px;
  background: rgba(8, 18, 33, 0.6);
}
.cc-history-range {
  min-width: 34px;
  padding: 4px 7px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}
.cc-history-range:hover { color: var(--ink); background: rgba(47, 155, 255, 0.1); }
.cc-history-range.active {
  background: linear-gradient(135deg, rgba(47, 155, 255, 0.92), rgba(34, 211, 238, 0.78));
  color: #041020;
  box-shadow: 0 6px 18px -10px rgba(47, 155, 255, 0.9);
}

.cc-history-tabs { display: flex; flex-wrap: wrap; gap: 5px; }
.cc-history-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 999px;
  background: rgba(8, 18, 33, 0.5);
  color: var(--muted);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.cc-history-tab i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; }
.cc-history-tab:hover { color: var(--ink); border-color: rgba(127, 196, 255, 0.35); }
.cc-history-tab.active {
  color: var(--ink);
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.14);
  box-shadow: 0 0 20px -10px rgba(47, 155, 255, 0.9);
}

.cc-history-panel { padding: 11px 12px 9px; overflow: visible; }
.cc-history-panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.cc-history-panel-title { color: var(--ink); font-size: 10px; font-weight: 800; }
.cc-history-panel-sub { margin-top: 2px; color: var(--muted); font-size: 8px; }
.cc-history-stats { display: flex; flex-wrap: wrap; gap: 9px; color: var(--muted); font-size: 8px; }
.cc-history-stats b { color: var(--ink); font-variant-numeric: tabular-nums; }
.cc-history-stats .peak b { color: #ff6b62; }
.cc-history-stats .low b { color: #00d47e; }

.cc-history-plot { position: relative; width: 100%; }
.cc-history-plot svg { display: block; width: 100%; height: auto; overflow: visible; }
.cc-history-axis-label { fill: #7f8ea6; font-size: 9px; font-family: inherit; }

/* A small entrance animation: the trend draws left-to-right, then the dots and
   latest-sample beacon settle in. Range and tab switches replay it. */
.cc-history-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: cc-history-draw 1.15s cubic-bezier(0.33, 0, 0.2, 1) forwards;
}
.cc-history-area { opacity: 0; animation: cc-history-area-in 1.1s ease 0.15s forwards; }
.cc-history-dots { opacity: 0; animation: cc-history-fade-in 0.7s ease 0.55s forwards; }
.cc-history-latest { opacity: 0; animation: cc-history-fade-in 0.5s ease 1.1s forwards; }
.cc-history-latest > circle:first-child {
  transform-box: fill-box;
  transform-origin: center;
  animation: cc-history-pulse 2.4s ease-out 1.3s infinite;
}

@keyframes cc-history-draw { to { stroke-dashoffset: 0; } }
@keyframes cc-history-area-in { to { opacity: 0.12; } }
@keyframes cc-history-fade-in { to { opacity: 1; } }
@keyframes cc-history-pulse {
  0% { transform: scale(0.55); opacity: 0.85; }
  70%, 100% { transform: scale(1.5); opacity: 0; }
}
.cc-history-tip {
  position: absolute;
  top: 4px;
  z-index: 3;
  min-width: 118px;
  padding: 6px 8px;
  border: 1px solid rgba(127, 196, 255, 0.3);
  border-radius: 8px;
  background: rgba(5, 12, 23, 0.94);
  box-shadow: 0 14px 32px -16px rgba(0, 0, 0, 0.9);
  transform: translateX(-50%);
  pointer-events: none;
}
.cc-history-tip-time { margin-bottom: 3px; color: var(--muted); font-size: 7.5px; }
.cc-history-tip-row { display: flex; align-items: center; gap: 5px; color: var(--ink-2); font-size: 8px; white-space: nowrap; }
.cc-history-tip-row i { flex: 0 0 auto; width: 7px; height: 7px; border-radius: 2px; }
.cc-history-tip-row span { flex: 1; }
.cc-history-tip-row b { color: var(--ink); font-variant-numeric: tabular-nums; }

.cc-history-legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-top: 7px; color: var(--muted); font-size: 8px; }
.cc-history-legend span { display: inline-flex; align-items: center; gap: 5px; }
.cc-history-legend i { display: inline-block; width: 8px; height: 3px; border-radius: 2px; }
.cc-history-legend b { font-variant-numeric: tabular-nums; }
.cc-history-note { margin-top: 6px; color: #5f7591; font-size: 7.5px; }
.cc-history-loading,
.cc-history-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border: 1px dashed var(--border);
  border-radius: 10px;
  color: #5f7591;
  font-size: 9px;
}

.cc-cmp-list { display: flex; flex-direction: column; gap: 7px; }
.cc-cmp-row { min-width: 0; }
.cc-cmp-top { display: flex; justify-content: space-between; gap: 6px; margin-bottom: 3px; color: var(--ink-2); font-size: 8px; }
.cc-cmp-top .cc-muted { white-space: nowrap; }
.cc-cmp-legend { margin-top: 2px; color: #5f7591; font-size: 7.5px; }

.cc-facts { display: grid; grid-template-columns: 1fr; gap: 0; margin: 0; }
.cc-facts > div { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; border-bottom: 1px solid var(--border-soft); font-size: 8.2px; }
.cc-facts > div:last-child { border-bottom: 0; }
.cc-facts dt { margin: 0; color: var(--muted); }
.cc-facts dd { margin: 0; color: var(--ink); font-weight: 600; text-align: right; }

.cc-modal-health {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: 3px;
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.cc-detail-empty { padding: 16px 8px; color: var(--muted); font-size: 9px; text-align: center; }
.cc-detail-problems { font-size: 8.6px; }
.cc-detail-problem-name { max-width: 420px; overflow: hidden; text-overflow: ellipsis; }

.cc-modal-foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 8px 18px;
  border-top: 1px solid rgba(27, 52, 81, 0.8);
  background: rgba(7, 17, 30, 0.9);
  color: #5f7591;
  font-size: 8px;
}

.cc-detail-note { flex: 1; min-width: 200px; }
.cc-detail-note.error { color: #ffb3bf; }
.cc-detail-note.partial { color: var(--amber); }
.cc-modal-link { color: #7fc4ff; text-decoration: none; font-weight: 700; white-space: nowrap; }
.cc-modal-link:hover { color: #fff; }

/* \u2500\u2500 Freshness (kept for the inventory page) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.cc-freshness-body { display: flex; flex-direction: column; align-items: center; padding: 7px 8px 8px; }
.cc-freshness .cc-donut { width: 108px; height: 108px; }
.cc-freshness-legend { width: 100%; margin-top: 5px; display: flex; flex-direction: column; gap: 3px; }
.cc-freshness-legend .cc-legend-row { font-size: 8px; }

.cc-donut { position: relative; width: 88px; height: 88px; flex: 0 0 auto; }
.cc-donut svg { width: 100%; height: 100%; display: block; }
.cc-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cc-donut-value { font-size: 17px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.cc-donut-unit { margin-top: 2px; color: var(--muted); font-size: 7.5px; }

.cc-bars { display: flex; align-items: flex-end; gap: 2px; height: 52px; flex: 1; min-width: 34px; }
.cc-bar { flex: 1; min-width: 2px; border-radius: 1px 1px 0 0; opacity: 0.9; }

/* \u2500\u2500 Motion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

@keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes cc-live-pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(0, 212, 126, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 212, 126, 0); }
}
@keyframes cc-live-pulse-amber {
  0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(255, 193, 7, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
}
@keyframes cc-live-pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(255, 77, 103, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(255, 77, 103, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 77, 103, 0); }
}
@keyframes cc-title-shine { to { background-position: -220% 0; } }
@keyframes cc-marquee { to { transform: translateX(-50%); } }
@keyframes cc-gauge-draw { from { stroke-dasharray: 0 100; } }
@keyframes cc-spark-draw { to { stroke-dashoffset: 0; } }
@keyframes cc-usage-grow { from { transform: scaleX(0); } }
@keyframes cc-cell-ring {
  0%, 100% { opacity: 0; }
  45% { opacity: 1; }
}
@keyframes cc-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: none; }
}
@keyframes cc-drift-a { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(70px, 50px, 0) scale(1.05); } }
@keyframes cc-drift-b { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(-70px, 50px, 0) scale(0.95); } }

/* Motion is decided in JavaScript (see motionAllowed in data/config.ts) so an
   administrator can override a system prefers-reduced-motion setting for an
   always-on wall display. Without the override class the animations run. */
.cc-app.cc-motion-off,
.cc-app.cc-motion-off *,
.cc-app.cc-motion-off *::before,
.cc-app.cc-motion-off *::after {
  animation: none !important;
  transition: none !important;
}

/* \u2500\u2500 Readability pass \u2014 match the Magic UI concept build \u2500\u2500\u2500\u2500\u2500\u2500\u2500
   The first port kept the dense wall-display type sizes. The
   concept build later raised type, spacing and control sizes;
   these overrides bring the plugin to the same scale. */

.cc-eyebrow { font-size: 9.5px; }
.cc-title { font-size: clamp(22px, 1.75vw, 28px); }
.cc-subtitle { font-size: 12px; }

.cc-clock-date { font-size: 10.5px; }
.cc-clock-time { font-size: 23px; }
.cc-clock-zone { font-size: 10px; }

.cc-mode button { font-size: 11px; }
.cc-zabbix-label { font-size: 13px; }
.cc-zabbix-sub { font-size: 9.5px; }
.cc-sample-badge { font-size: 9px; }
.cc-banner { font-size: 11px; }
.cc-banner-btn { font-size: 10px; }

.cc-kpis { gap: 10px; margin-bottom: 14px; }
.cc-kpi { gap: 11px; min-height: 112px; padding: 15px 14px; }
.cc-kpi-icon { width: 32px; height: 32px; border-radius: 9px; }
.cc-kpi-label { font-size: 9.5px; letter-spacing: 0.06em; }
.cc-kpi-value { font-size: clamp(23px, 1.75vw, 27px); }
.cc-kpi-sub {
  overflow: visible;
  margin-top: 3px;
  font-size: 10px;
  line-height: 1.35;
  text-overflow: clip;
  white-space: normal;
}
.cc-kpi-delta { font-size: 9px; }
.cc-kpi-link::before { font-size: 13px; }

.cc-panel { padding: 15px 16px; }
.cc-panel-title { font-size: 13.5px; }
.cc-panel-sub { margin-top: 3px; font-size: 10.5px; }

.cc-util-row { gap: 12px; margin-bottom: 14px; }
.cc-util-body { gap: 16px; margin-top: 13px; }
.cc-ring { width: 92px; height: 92px; }
.cc-ring::before { inset: 9px; }
.cc-ring-inner strong { font-size: 18px; }
.cc-ring-inner span { font-size: 8.5px; }
.cc-stackbar { height: 9px; }
.cc-legend { gap: 5px; margin-top: 10px; }
.cc-legend-row { grid-template-columns: 8px 1fr auto; gap: 7px; font-size: 9.5px; }
.cc-dot { width: 7px; height: 7px; }

.cc-groups { gap: 12px; margin-bottom: 14px; }
.cc-group { padding: 14px 16px; }
.cc-group-head { margin-bottom: 6px; }
.cc-group-name { gap: 8px; font-size: 12.5px; }
.cc-group-total { font-size: 10px; }
.cc-group-legend { gap: 4px 11px; font-size: 9.5px; }
.cc-lg i { width: 6px; height: 6px; }
.cc-tier-row { grid-template-columns: 98px minmax(0, 1fr); gap: 10px; padding: 9px 0; }
.cc-tier-title { font-size: 11.5px; }
.cc-tier-sub { font-size: 9.5px; }
.cc-tier-counts span { font-size: 9.5px; }
.cc-host-grid { gap: 2.5px; }
.cc-cell { width: 7px; height: 7px; border-radius: 2px; }
.cc-legend-inline { font-size: 9.5px; }

.cc-bottom { gap: 12px; margin-bottom: 14px; }
.cc-table { margin-top: 11px; font-size: 11.5px; }
.cc-table th { padding-bottom: 7px; font-size: 9px; }
.cc-table td { padding: 7px 7px 7px 0; }
.cc-tabs { padding: 3px; border-radius: 8px; margin-top: 10px; }
.cc-tab { padding: 5px 10px; border-radius: 6px; font-size: 10px; }
.cc-status { font-size: 9.5px; }
.cc-row-arrow { font-size: 12px; }

.cc-problem-tabs { padding: 8px 0 10px; }
.cc-problem-table { min-width: 1460px; font-size: 10.5px; }
.cc-problem-table td { padding: 8px 9px 8px 0; }
.cc-problem-table thead th { padding-bottom: 7px; font-size: 9px; }
.cc-sev { font-size: 9.5px; }
.cc-footer { padding-top: 12px; font-size: 9.5px; }

.cc-modal-kicker { font-size: 10.5px; letter-spacing: 0.14em; }
.cc-modal-source { font-size: 9.5px; }
.cc-modal-sub { font-size: 11.5px; }
.cc-modal-close { font-size: 22px; }
.cc-gauge-center strong { font-size: 24px; }
.cc-gauge-center span { font-size: 10px; }
.cc-metric-name { font-size: 9.5px; }
.cc-metric-band { font-size: 8.5px; }
.cc-metric-fleet { font-size: 9px; }
.cc-metric-foot { font-size: 8.5px; }
.cc-detail-spark-empty { font-size: 9px; }
.cc-fs-mount { font-size: 9.5px; }
.cc-fs-value { font-size: 9.5px; }
.cc-fs-legend { font-size: 8.5px; }
.cc-cmp-top { font-size: 9px; }
.cc-cmp-legend { font-size: 8.5px; }
.cc-facts > div { font-size: 9.2px; }
.cc-modal-health { font-size: 8.5px; }
.cc-detail-empty { font-size: 10px; }
.cc-detail-problems { font-size: 9.5px; }
.cc-modal-foot { font-size: 9px; }
.cc-freshness-legend .cc-legend-row { font-size: 9px; }
.cc-donut-value { font-size: 18px; }
.cc-donut-unit { font-size: 8.5px; }

/* \u2500\u2500 Data Center Operation dashboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* DCO shows eight KPIs (no stale tile), so it gets eight equal columns and
   fills the row edge to edge. The :where() wrapper keeps this at the same
   specificity as the base .cc-kpis rule so the responsive column counts
   defined later still win. */
:where(.cc-dc) .cc-kpis {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

/* Production, Disaster Recovery and Servers in Maintenance share one row:
   the two Infrastructure group panels on the left, the maintenance list on
   the right. All three stretch to the row height. */
.cc-dc-envs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

/* The maintenance list is capped by the environment panels, not by its own
   length: size containment keeps a long list from making the row taller. */
.cc-dc-envs > .cc-panel:not(.cc-group) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  contain: size;
}

.cc-maintenance-scroll {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 520px;
  overflow: auto;
  margin-top: 9px;
  border-radius: 8px;
}

.cc-maintenance-scroll .cc-table-wrap { overflow: visible; }

.cc-dc-envs .cc-maintenance-table .cc-col-secondary { display: none; }

.cc-maintenance-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #0a1526;
  box-shadow: 0 1px 0 var(--border);
}

.cc-maintenance-state {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--cyan);
  white-space: nowrap;
}

.cc-maintenance-state i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: var(--cyan);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.7);
}

/* \u2500\u2500 Responsive \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

@media (max-width: 1500px) {
  .cc-kpis { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .cc-bottom { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 1400px) {
  .cc-title { white-space: normal; }
  .cc-header-filters { order: 3; flex: 1 1 100%; max-width: none; margin-top: 2px; }
}

@media (max-width: 1200px) {
  .cc-util-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-groups { grid-template-columns: 1fr; }
  .cc-dc-envs { grid-template-columns: 1fr; }
  /* Stacked, the maintenance panel sets its own height again. */
  .cc-dc-envs > .cc-panel:not(.cc-group) { contain: none; }
  .cc-maintenance-scroll { max-height: 360px; }
  .cc-header-right { margin-left: 0; }

}

@media (max-width: 1000px) {
  .cc-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-detail-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .cc-filter-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .cc-app { padding: 10px; }
  .cc-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-util-row, .cc-bottom { grid-template-columns: 1fr; }
  .cc-title { font-size: 18px; }
  .cc-subtitle { white-space: normal; }
  .cc-header-filters { order: 0; flex: 0 0 auto; width: 100%; margin-top: 0; }
}

@media (max-width: 620px) {
  .cc-ticker-label { display: none; }
  .cc-modal-backdrop { padding: 0; }
  .cc-modal { max-height: 100vh; border-radius: 0; border-left: 0; border-right: 0; }
  .cc-modal-head, .cc-modal-body, .cc-modal-foot { padding-left: 12px; padding-right: 12px; }
  .cc-modal-title { font-size: 18px; }
  .cc-fs-mount { width: 44px; }
}

/* Static fallbacks for entrance animations whose initial state is hidden; the
   class is added when motion is disabled, whether by the system preference or
   by the plugin's own Animations setting. */
.cc-app.cc-motion-off .cc-ticker-track,
.cc-app.cc-motion-off .cc-modal-beam,
.cc-app.cc-motion-off .cc-modal-aurora,
.cc-app.cc-motion-off .cc-title,
.cc-app.cc-motion-off .cc-srv-title,
.cc-app.cc-motion-off .cc-modal-title,
.cc-app.cc-motion-off .cc-gauge-fill,
.cc-app.cc-motion-off .cc-usage-track > span { animation: none; }
.cc-app.cc-motion-off .cc-spark-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
.cc-app.cc-motion-off .cc-history-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
.cc-app.cc-motion-off .cc-history-area { animation: none; opacity: 0.12; }
.cc-app.cc-motion-off .cc-history-dots,
.cc-app.cc-motion-off .cc-history-latest { animation: none; opacity: 1; }
.cc-app.cc-motion-off .cc-history-latest > circle:first-child { animation: none; opacity: 0.35; }
`;

      const ESTATE_FROZEN_MINUTES = 15;
      let estateAnchorClock = 0;
      let estateAnchorAt = 0;
      let estateFrozen = false;
      function zabbixReferenceNow(items) {
        let newest = 0;
        for (const item of items) {
          const clock = parseInt(item.lastclock || "0", 10) || 0;
          if (clock > newest) {
            newest = clock;
          }
        }
        if (newest <= 0) {
          return Math.floor(Date.now() / 1e3);
        }
        const mono = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
        if (newest > estateAnchorClock) {
          estateAnchorClock = newest;
          estateAnchorAt = mono;
          estateFrozen = false;
        } else if (estateAnchorAt > 0 && (mono - estateAnchorAt) / 6e4 > ESTATE_FROZEN_MINUTES) {
          estateFrozen = true;
        }
        return newest;
      }
      const SEVERITY_GROUP = {
        0: "Info",
        1: "Info",
        2: "Warning",
        3: "Warning",
        4: "Critical",
        5: "Critical"
      };
      const SEVERITY_LABEL = {
        0: "Info",
        1: "Info",
        2: "Warning",
        3: "Warning",
        4: "High",
        5: "Critical"
      };
      function timeLabel(clockSec) {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Singapore",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).formatToParts(new Date(clockSec * 1e3));
        const get = (type) => parts.find((p) => p.type === type)?.value || "";
        return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
      }
      function durationLabel(minutes) {
        const m = Math.max(1, Math.round(minutes));
        if (m < 60) {
          return `${m}m`;
        }
        return `${Math.floor(m / 60)}h ${m % 60}m`;
      }
      function tagValue(tags, names) {
        if (!tags) {
          return void 0;
        }
        const wanted = names.map((n) => n.toLowerCase());
        const hit = tags.find((t) => wanted.includes(String(t.tag || "").toLowerCase()));
        return hit ? String(hit.value || "").trim() || void 0 : void 0;
      }
      function inferEnvironment(groupNames) {
        const text = groupNames.join(" ");
        if (/disaster|\bdr\b|recovery/i.test(text)) {
          return "DR";
        }
        if (/uat|\bdev\b|development|test|qa/i.test(text)) {
          return "UAT";
        }
        return "PROD";
      }
      function normalizeEnvironment(value, groups) {
        const v = (value || "").toLowerCase();
        if (v.includes("dr") || v.includes("disaster")) {
          return "DR";
        }
        if (v.includes("uat") || v.includes("dev") || v.includes("test") || v.includes("qa")) {
          return "UAT";
        }
        if (v.includes("prod") || v.includes("prd")) {
          return "PROD";
        }
        return inferEnvironment(groups);
      }
      function normalizeTier(value) {
        const v = (value || "").toLowerCase();
        if (v.includes("1") || v.includes("core") || v.includes("critical")) {
          return "Tier 1";
        }
        if (v.includes("2")) {
          return "Tier 2";
        }
        return "Tier 3";
      }
      const IBM_I_PATTERN = /ibm\s*i\b|as\/?400|os\/?400|i5\/os|iseries/i;
      function osFromInventory(host) {
        const text = `${host.inventory?.os || ""} ${host.inventory?.os_full || ""}`;
        if (IBM_I_PATTERN.test(text)) {
          return "IBM i";
        }
        if (/windows/i.test(text)) {
          return "Windows";
        }
        if (/\baix\b/i.test(text)) {
          return "AIX";
        }
        if (/solaris/i.test(text)) {
          return "Solaris";
        }
        return "Linux";
      }
      function osFromItems(items) {
        if (items.some((item) => /^as400\./i.test(item.key_))) {
          return "IBM i";
        }
        const uname = items.find((item) => item.key_ === "system.uname");
        if (uname && IBM_I_PATTERN.test(uname.lastvalue || "")) {
          return "IBM i";
        }
        return null;
      }
      function isAggregateProcCpu(key) {
        if (!/^proc\.cpu\.util\[/i.test(key)) {
          return false;
        }
        const args = key.slice(key.indexOf("[") + 1, -1).split(",");
        return (args[0] || "").trim() === "" && args.some((arg) => arg.trim().toLowerCase() === "total");
      }
      function numeric(value) {
        if (value === void 0 || value === null || value === "") {
          return null;
        }
        const n = parseFloat(value);
        return Number.isFinite(n) ? n : null;
      }
      function metricForHost(items, nowSec) {
        let cpu = null;
        let memory = null;
        let disk = null;
        let netIn = 0;
        let netOut = 0;
        let sawNet = false;
        let cpuItem;
        let memItem;
        let diskItem;
        let lastClock = 0;
        let aggregateCpu = null;
        let aggregateCpuItem;
        let cpuFallbackSum = 0;
        let cpuFallbackCount = 0;
        let cpuFallbackItem;
        let memAvailable = null;
        let memFree = null;
        let memTotal = null;
        for (const item of items) {
          const key = item.key_ || "";
          const value = numeric(item.lastvalue);
          const clock = parseInt(item.lastclock || "0", 10) || 0;
          if (clock > lastClock) {
            lastClock = clock;
          }
          if (value === null) {
            continue;
          }
          if (key === "system.cpu.util") {
            cpu = value;
            cpuItem = item.itemid;
          } else if (isAggregateProcCpu(key)) {
            if (aggregateCpu === null) {
              aggregateCpu = value;
              aggregateCpuItem = item.itemid;
            }
          } else if (/hrProcessorLoad/i.test(key)) {
            cpuFallbackSum += value;
            cpuFallbackCount += 1;
            cpuFallbackItem = item.itemid;
          } else if (key === "vm.memory.util" || key === "vm.memory.utilization") {
            memory = value;
            memItem = item.itemid;
          } else if (key === "vm.memory.size[pavailable]" && memory === null) {
            memory = Math.max(0, 100 - value);
            memItem = item.itemid;
          } else if (key === "vm.memory.size[pfree]" && memory === null) {
            memory = Math.max(0, 100 - value);
            memItem = item.itemid;
          } else if (key === "vm.memory.size[available]") {
            memAvailable = value;
          } else if (key === "vm.memory.size[free]") {
            memFree = value;
          } else if (key === "vm.memory.size[total]") {
            memTotal = value;
          } else if (/^vfs\.fs\.(dependent\.)?size\[[^\]]*pused[^\]]*\]$/i.test(key) || /^as400\.disk\.size\[[^\]]*pused[^\]]*\]$/i.test(key)) {
            if (disk === null || value > disk) {
              disk = value;
              diskItem = item.itemid;
            }
          } else if ((/^net\.if\.in\[[^\]]*\]$/i.test(key) || /^if(HC)?InOctets\[/i.test(key) && /bps/i.test(item.units || "")) && !/errors|dropped|collisions/i.test(key)) {
            netIn += value;
            sawNet = true;
          } else if ((/^net\.if\.out\[[^\]]*\]$/i.test(key) || /^if(HC)?OutOctets\[/i.test(key) && /bps/i.test(item.units || "")) && !/errors|dropped|collisions/i.test(key)) {
            netOut += value;
            sawNet = true;
          }
        }
        if (cpu === null && aggregateCpu !== null) {
          cpu = aggregateCpu;
          cpuItem = aggregateCpuItem;
        } else if (cpu === null && cpuFallbackCount > 0) {
          cpu = cpuFallbackSum / cpuFallbackCount;
          cpuItem = cpuFallbackItem;
        }
        if (memory === null && memTotal !== null && memTotal > 0) {
          if (memAvailable !== null) {
            memory = Math.max(0, 100 - memAvailable / memTotal * 100);
          } else if (memFree !== null) {
            memory = Math.max(0, 100 - memFree / memTotal * 100);
          }
        }
        const lastSeenMin = lastClock > 0 ? Math.max(0, Math.round((nowSec - lastClock) / 60)) : 9999;
        const network = sawNet ? Math.min(100, (netIn + netOut) / 1e9 * 100) : 0;
        return {
          cpu: Math.round(cpu ?? 0),
          memory: Math.round(memory ?? 0),
          disk: Math.round(disk ?? 0),
          network: Math.round(network * 10) / 10,
          lastSeenMin,
          itemIds: { cpu: cpuItem, memory: memItem, disk: diskItem },
          hasItems: items.length > 0
        };
      }
      function downsample(values, buckets = 24) {
        if (values.length === 0) {
          return [];
        }
        if (values.length <= buckets) {
          return values;
        }
        const out = [];
        const size = values.length / buckets;
        for (let i = 0; i < buckets; i++) {
          const start = Math.floor(i * size);
          const end = Math.max(start + 1, Math.floor((i + 1) * size));
          const slice = values.slice(start, end);
          out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
        }
        return out;
      }
      function utilization(hosts, key) {
        const values = hosts.map((h) => h[key]);
        const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        return {
          avg,
          critical: values.filter((v) => v >= 90).length,
          warning: values.filter((v) => v >= 70 && v < 90).length,
          normal: values.filter((v) => v < 70).length
        };
      }
      async function fetchZabbixData() {
        const config = await loadZabbixConfig();
        const rpc = (method, params, route = "api") => zabbixRpc(config, method, params, route);
        const empty = {
          hosts: [],
          problems: [],
          businessServices: [],
          drComponents: [],
          topServers: [],
          utilization: {
            cpu: { avg: 0, critical: 0, warning: 0, normal: 0 },
            memory: { avg: 0, critical: 0, warning: 0, normal: 0 },
            disk: { avg: 0, critical: 0, warning: 0, normal: 0 },
            network: { avg: 0, critical: 0, warning: 0, normal: 0 }
          },
          kpiDeltas: { available: "", unavailable: "", warning: "", critical: "" }
        };
        const versionPromise = rpc("apiinfo.version", {}, "public").catch(() => "");
        const [hostsRaw, problemsRaw, triggersRaw, itemsRaw, maintenancesRaw, version] = await Promise.all([
          rpc("host.get", {
            output: ["hostid", "host", "name", "status", "available", "maintenance_status"],
            selectGroups: ["groupid", "name"],
            selectTags: "extend",
            selectInterfaces: ["interfaceid", "available"],
            selectInventory: ["os", "os_full"],
            monitored: true
          }),
          rpc("problem.get", { output: "extend", selectTags: "extend" }),
          rpc("trigger.get", {
            output: ["triggerid", "description", "priority"],
            selectHosts: ["hostid", "host"],
            filter: { value: 1 },
            monitored: true
          }),
          rpc("item.get", {
            output: ["itemid", "hostid", "key_", "name", "lastvalue", "lastclock", "units"],
            monitored: true,
            limit: 5e3
          }),
          rpc("maintenance.get", { output: "extend", selectHosts: ["hostid"] }),
          versionPromise
        ]);
        const now = zabbixReferenceNow(itemsRaw);
        const itemsByHost = /* @__PURE__ */ new Map();
        for (const item of itemsRaw) {
          const list = itemsByHost.get(item.hostid) || [];
          list.push(item);
          itemsByHost.set(item.hostid, list);
        }
        const maintenanceHostIds = /* @__PURE__ */ new Set();
        for (const m of maintenancesRaw) {
          for (const h of m.hosts || []) {
            maintenanceHostIds.add(h.hostid);
          }
        }
        const triggerById = /* @__PURE__ */ new Map();
        const maxSeverityByHost = /* @__PURE__ */ new Map();
        for (const t of triggersRaw) {
          triggerById.set(t.triggerid, t);
          const priority = parseInt(t.priority || "0", 10) || 0;
          for (const h of t.hosts || []) {
            const prev = maxSeverityByHost.get(h.hostid) || 0;
            if (priority > prev) {
              maxSeverityByHost.set(h.hostid, priority);
            }
          }
        }
        const metricsByHost = /* @__PURE__ */ new Map();
        for (const zh of hostsRaw) {
          metricsByHost.set(zh.hostid, metricForHost(itemsByHost.get(zh.hostid) || [], now));
        }
        const hosts = hostsRaw.map((zh, index) => {
          const groups = (zh.groups || []).map((g) => g.name);
          const hostItems = itemsByHost.get(zh.hostid) || [];
          const metrics = metricsByHost.get(zh.hostid) || metricForHost(hostItems, now);
          const maintenance = zh.maintenance_status === "1" || maintenanceHostIds.has(zh.hostid);
          const unavailable = zh.available === "2" || (zh.interfaces || []).some((i) => i.available === "2");
          const severityNum = maxSeverityByHost.get(zh.hostid) || 0;
          const critical = severityNum >= 4;
          const warning = severityNum >= 2 && !critical;
          let dataState = "upToDate";
          if (!metrics.hasItems) {
            dataState = "notMonitored";
          } else if (estateFrozen || metrics.lastSeenMin > 10) {
            dataState = "noData";
          } else if (metrics.lastSeenMin > 5) {
            dataState = "stale";
          }
          const health = maintenance ? "maintenance" : unavailable ? "unavailable" : critical ? "critical" : warning ? "warning" : dataState === "stale" || dataState === "noData" ? "stale" : "healthy";
          return {
            id: parseInt(zh.hostid, 10) || index + 1,
            hostname: zh.host,
            environment: normalizeEnvironment(tagValue(zh.tags, ["environment", "env"]), groups),
            hostGroup: groups[0] || "Ungrouped",
            tier: normalizeTier(tagValue(zh.tags, ["tier", "system_tier", "system tier"])),
            os: osFromItems(hostItems) || osFromInventory(zh),
            businessService: tagValue(zh.tags, ["business_service", "business service", "service"]) || "Unassigned",
            health,
            connectivity: unavailable ? "unavailable" : "available",
            severity: critical ? "critical" : warning ? "warning" : null,
            maintenance,
            stale: dataState === "stale" || dataState === "noData",
            lastSeenMin: metrics.lastSeenMin,
            dataState,
            drRole: "N/A",
            cpu: metrics.cpu,
            memory: metrics.memory,
            disk: metrics.disk,
            network: metrics.network
          };
        });
        const hostByHostname = new Map(hosts.map((h) => [h.hostname, h]));
        const problems = problemsRaw.map((zp, index) => {
          const trigger = triggerById.get(zp.objectid);
          const zhost = trigger?.hosts?.[0]?.host || "unknown";
          const host = hostByHostname.get(zhost);
          const severityNum = parseInt(zp.severity || "0", 10) || 0;
          const clock = parseInt(zp.clock || "0", 10) || Math.floor(now);
          const minutesAgo = Math.max(0, Math.round((now - clock) / 60));
          const tags = (zp.tags || []).map((t) => `${t.tag}:${t.value}`).slice(0, 3);
          return {
            id: index + 1,
            time: timeLabel(clock),
            minutesAgo,
            severity: SEVERITY_LABEL[severityNum] || "Info",
            severityGroup: SEVERITY_GROUP[severityNum] || "Info",
            hostname: zhost,
            environment: host?.environment || "PROD",
            tier: host?.tier || "Tier 3",
            businessService: host?.businessService || "Unassigned",
            problem: zp.name,
            currentValue: zp.opdata && zp.opdata.trim() ? zp.opdata : "-",
            threshold: "-",
            duration: durationLabel(minutesAgo),
            sla: "Not tracked",
            ack: zp.acknowledged === "1",
            maintenance: zp.suppressed === "1",
            related: tags.length ? tags.join(" \xB7 ") : "\u2014"
          };
        });
        problems.sort((a, b) => a.minutesAgo - b.minutesAgo);
        const serviceMap = /* @__PURE__ */ new Map();
        for (const h of hosts) {
          const list = serviceMap.get(h.businessService) || [];
          list.push(h);
          serviceMap.set(h.businessService, list);
        }
        const businessServices = Array.from(serviceMap.entries()).map(([name, serviceHosts]) => {
          const envs = new Set(serviceHosts.map((h) => h.environment));
          const activeProblems = problems.filter((p) => p.businessService === name).length;
          const status = serviceHosts.some((h) => h.health === "critical") ? "Critical" : serviceHosts.some((h) => h.health === "warning" || h.health === "stale") ? "Warning" : "Healthy";
          return {
            name,
            env: envs.size === 1 ? Array.from(envs)[0] : "Mixed",
            servers: serviceHosts.length,
            status,
            activeProblems
          };
        }).sort((a, b) => b.servers - a.servers);
        const topSorted = hosts.slice().sort((a, b) => b.cpu - a.cpu || b.memory - a.memory || b.disk - a.disk).slice(0, 10);
        const metricItemByHost = /* @__PURE__ */ new Map();
        for (const zh of hostsRaw) {
          metricItemByHost.set(zh.host, metricsByHost.get(zh.hostid)?.itemIds || {});
        }
        const historyIds = /* @__PURE__ */ new Set();
        for (const row of topSorted) {
          const ids = metricItemByHost.get(row.hostname);
          if (!ids) {
            continue;
          }
          if (ids.cpu) historyIds.add(ids.cpu);
          if (ids.memory) historyIds.add(ids.memory);
          if (ids.disk) historyIds.add(ids.disk);
        }
        const historyByItem = /* @__PURE__ */ new Map();
        if (historyIds.size > 0) {
          try {
            const history = await rpc("history.get", {
              output: ["itemid", "clock", "value"],
              history: 0,
              itemids: Array.from(historyIds),
              time_from: Math.floor(now) - 86400,
              sortfield: "clock",
              sortorder: "DESC",
              limit: 5e3
            });
            for (const point of history) {
              const list = historyByItem.get(point.itemid) || [];
              const v = numeric(point.value);
              if (v !== null) {
                list.push(v);
              }
              historyByItem.set(point.itemid, list);
            }
            for (const [id, values] of historyByItem.entries()) {
              historyByItem.set(id, downsample(values.slice().reverse()).map((v) => Math.max(0, Math.min(100, Math.round(v)))));
            }
          } catch {
          }
        }
        const flat = (value) => Array.from({ length: 24 }, () => Math.round(value));
        const topServers = topSorted.map((h, i) => {
          const ids = metricItemByHost.get(h.hostname) || {};
          return {
            rank: i + 1,
            hostname: h.hostname,
            environment: h.environment,
            tier: h.tier,
            os: h.os,
            businessService: h.businessService,
            cpu: h.cpu,
            memory: h.memory,
            disk: h.disk,
            trends: {
              cpu: ids.cpu && historyByItem.get(ids.cpu) || flat(h.cpu),
              memory: ids.memory && historyByItem.get(ids.memory) || flat(h.memory),
              disk: ids.disk && historyByItem.get(ids.disk) || flat(h.disk)
            }
          };
        });
        const data = {
          ...empty,
          hosts,
          problems,
          businessServices,
          topServers,
          utilization: {
            cpu: utilization(hosts, "cpu"),
            memory: utilization(hosts, "memory"),
            disk: utilization(hosts, "disk"),
            network: utilization(hosts, "network")
          }
        };
        return {
          data,
          version: version || "Unknown",
          fetchedAt: new Date(now * 1e3),
          transport: config.transport
        };
      }

      const LEGACY_KEYS = ["opsbeacon-live-snapshot-v1", "opsbeacon-live-fetch-lock-v1"];
      function clearLegacyCache() {
        if (typeof window === "undefined") {
          return;
        }
        try {
          for (const key of LEGACY_KEYS) {
            window.localStorage.removeItem(key);
          }
        } catch (err) {
        }
      }
      clearLegacyCache();
      async function fetchLiveData() {
        return fetchZabbixData();
      }

      const ALL$2 = "All";
      const ALL_FILTERS$2 = {
        environment: ALL$2,
        tier: ALL$2,
        hostGroup: ALL$2,
        os: ALL$2,
        businessService: ALL$2
      };
      const TIER_SUBTITLE = {
        "Tier 1": "Core Banking",
        "Tier 2": "Business Critical",
        "Tier 3": "Supporting"
      };
      function urlRequestedSource() {
        return typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("source") : null;
      }
      function initialSource(canGoLive) {
        if (!canGoLive || typeof window === "undefined") {
          return "sample";
        }
        return urlRequestedSource() === "live" ? "live" : "sample";
      }
      function isStaleSampleLink(config) {
        return !!config && !config.sampleDataEnabled && urlRequestedSource() === "sample";
      }
      function useOpsData(initialConfig) {
        const sample = useMemo(() => buildSampleData(), []);
        const empty = useMemo(() => emptySampleData(), []);
        const canGoLive = useMemo(() => isGrafanaHosted(), []);
        const [sampleEnabled, setSampleEnabled] = useState(
          initialConfig ? initialConfig.sampleDataEnabled : true
        );
        const [source, setSource] = useState(() => {
          const requested = initialSource(canGoLive);
          const preferred = requested === "live" || initialConfig && initialConfig.defaultSource === "live" ? "live" : requested;
          return resolveSource(
            preferred,
            canGoLive,
            initialConfig ? initialConfig.sampleDataEnabled : true
          );
        });
        const [live, setLive] = useState(null);
        const [liveState, setLiveState] = useState("idle");
        const [liveError, setLiveError] = useState(null);
        const [liveTick, setLiveTick] = useState(0);
        const liveRef = useRef(null);
        const fetchingRef = useRef(false);
        const [refreshSeconds, setRefreshSeconds] = useState(
          initialConfig ? initialConfig.refreshSeconds : DEFAULT_ZABBIX_CONFIG.refreshSeconds
        );
        const [brandName, setBrandName] = useState(
          initialConfig ? initialConfig.brandName : DEFAULT_ZABBIX_CONFIG.brandName
        );
        const [brandTagline, setBrandTagline] = useState(
          initialConfig ? initialConfig.brandTagline : DEFAULT_ZABBIX_CONFIG.brandTagline
        );
        const [logoUrl, setLogoUrl] = useState(
          initialConfig ? initialConfig.logoUrl : DEFAULT_ZABBIX_CONFIG.logoUrl
        );
        const [motion, setMotion] = useState(
          initialConfig ? initialConfig.motion : DEFAULT_ZABBIX_CONFIG.motion
        );
        const sourceTouched = useRef(false);
        const staleFiltersCleared = useRef(isStaleSampleLink(initialConfig));
        const [filters, setFilters] = useState(() => ({ ...ALL_FILTERS$2 }));
        useEffect(() => {
          if (!canGoLive) {
            return;
          }
          let cancelled = false;
          loadZabbixConfig().then((config) => {
            if (cancelled) {
              return;
            }
            setRefreshSeconds(config.refreshSeconds);
            setSampleEnabled(config.sampleDataEnabled);
            setBrandName(config.brandName);
            setBrandTagline(config.brandTagline);
            setLogoUrl(config.logoUrl);
            setMotion(config.motion);
            if (!config.sampleDataEnabled) {
              sourceTouched.current = true;
              setSource("live");
              if (!staleFiltersCleared.current && isStaleSampleLink(config)) {
                staleFiltersCleared.current = true;
                setFilters({ ...ALL_FILTERS$2 });
              }
            } else if (!sourceTouched.current && config.defaultSource === "live") {
              setSource("live");
            }
          }).catch(() => {
          });
          return () => {
            cancelled = true;
          };
        }, [canGoLive]);
        const onSource = (next) => {
          sourceTouched.current = true;
          setSource(next);
        };
        useEffect(() => {
          if (source !== "live") {
            return;
          }
          const timer = window.setInterval(() => setLiveTick((t) => t + 1), refreshSeconds * 1e3);
          return () => window.clearInterval(timer);
        }, [source, refreshSeconds]);
        useEffect(() => {
          if (source !== "live" || fetchingRef.current) {
            return;
          }
          let cancelled = false;
          fetchingRef.current = true;
          if (!liveRef.current) {
            setLiveState("loading");
          }
          setLiveError(null);
          fetchLiveData().then((result) => {
            if (!cancelled) {
              liveRef.current = result;
              setLive(result);
              setLiveState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setLiveError(err.message || "Unable to reach the Zabbix API");
              setLiveState("error");
            }
          }).finally(() => {
            fetchingRef.current = false;
          });
          return () => {
            cancelled = true;
          };
        }, [source, liveTick]);
        const data = source === "live" && live ? live.data : sampleEnabled ? sample : empty;
        const effectiveSource = resolveSource(
          source === "live" && live ? "live" : "sample",
          canGoLive,
          sampleEnabled
        );
        const connection = source !== "live" ? "sample" : liveState === "ready" ? "ready" : liveState === "error" ? "error" : "loading";
        const filtersInitialised = useRef(false);
        useEffect(() => {
          if (!filtersInitialised.current) {
            filtersInitialised.current = true;
            return;
          }
          setFilters({ ...ALL_FILTERS$2 });
        }, [source]);
        const options = useMemo(() => {
          const envOrder = [
            { value: "PROD", label: "PROD" },
            { value: "DR", label: "DR" },
            { value: "UAT", label: "DEV / UAT" }
          ];
          const groupOrder = ["Production", "Disaster Recovery", "Development / UAT"];
          const groups2 = Array.from(new Set(data.hosts.map((h) => h.hostGroup))).sort((a, b) => {
            const ia = groupOrder.indexOf(a);
            const ib = groupOrder.indexOf(b);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
          });
          return {
            environments: envOrder,
            tiers: ["Tier 1", "Tier 2", "Tier 3"],
            groups: groups2,
            os: Array.from(new Set(data.hosts.map((h) => h.os))).sort(),
            services: data.businessServices.map((s) => s.name)
          };
        }, [data]);
        const onChange = (key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value }));
        };
        const filteredHosts = useMemo(
          () => data.hosts.filter((h) => matchesFilters(h, filters)),
          [data.hosts, filters]
        );
        const hostByHostname = useMemo(
          () => new Map(data.hosts.map((h) => [h.hostname, h])),
          [data.hosts]
        );
        const filteredProblems = useMemo(
          () => data.problems.filter((p) => {
            const h = hostByHostname.get(p.hostname);
            return !!h && matchesFilters(h, filters);
          }),
          [data.problems, hostByHostname, filters]
        );
        const fleet = useMemo(() => {
          const count = filteredHosts.length;
          const average = (key) => count ? filteredHosts.reduce((sum, host) => sum + host[key], 0) / count : 0;
          return {
            cpu: average("cpu"),
            memory: average("memory"),
            disk: average("disk"),
            network: average("network"),
            hosts: count
          };
        }, [filteredHosts]);
        const filtersActive = Object.values(filters).some((v) => v !== ALL$2);
        const total = filteredHosts.length;
        const unavailable = filteredHosts.filter((h) => h.connectivity === "unavailable").length;
        const maintenance = filteredHosts.filter((h) => h.maintenance).length;
        const stale = filteredHosts.filter((h) => h.stale).length;
        const warning = filteredHosts.filter((h) => h.severity === "warning").length;
        const critical = filteredHosts.filter((h) => h.severity === "critical").length;
        const available = filteredHosts.filter(
          (h) => h.connectivity !== "unavailable" && !h.maintenance && !h.stale
        ).length;
        const totalProblems = filteredProblems.length;
        const unacknowledged = filteredProblems.filter((p) => !p.ack).length;
        const utilization = useMemo(() => {
          if (!filtersActive && source === "sample") {
            return data.utilization;
          }
          const compute = (key) => {
            const values = filteredHosts.map((h) => h[key]);
            const avg = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
            return {
              avg,
              critical: values.filter((v) => v >= 90).length,
              warning: values.filter((v) => v >= 70 && v < 90).length,
              normal: values.filter((v) => v < 70).length
            };
          };
          return {
            cpu: compute("cpu"),
            memory: compute("memory"),
            disk: compute("disk"),
            network: compute("network")
          };
        }, [data.utilization, filtersActive, filteredHosts, source]);
        const groups = useMemo(() => {
          const defs = [
            { key: "PROD", name: "PRODUCTION", panelClass: "prod" },
            { key: "DR", name: "DISASTER RECOVERY", panelClass: "dr" },
            { key: "UAT", name: "DEVELOPMENT / UAT", panelClass: "uat" }
          ];
          return defs.map((d) => {
            const hosts = filteredHosts.filter((h) => h.environment === d.key);
            const tiers = ["Tier 1", "Tier 2", "Tier 3"].map((tier) => ({
              name: tier,
              subtitle: TIER_SUBTITLE[tier],
              hosts: hosts.filter((h) => h.tier === tier)
            }));
            return {
              ...d,
              total: hosts.length,
              healthy: hosts.filter((h) => h.health === "healthy").length,
              warning: hosts.filter((h) => h.health === "warning").length,
              critical: hosts.filter((h) => h.health === "critical").length,
              stale: hosts.filter((h) => h.health === "stale").length,
              maintenance: hosts.filter((h) => h.health === "maintenance").length,
              unavailable: hosts.filter((h) => h.health === "unavailable").length,
              tiers
            };
          });
        }, [filteredHosts]);
        const problemCounts = useMemo(
          () => ({
            All: filteredProblems.length,
            Critical: filteredProblems.filter((p) => p.severityGroup === "Critical").length,
            Warning: filteredProblems.filter((p) => p.severityGroup === "Warning").length,
            Info: filteredProblems.filter((p) => p.severityGroup === "Info").length
          }),
          [filteredProblems]
        );
        const inventoryHrefFor = (scope, filterSet, host) => {
          if (!canGoLive) {
            return void 0;
          }
          const params = new URLSearchParams({ scope, source: effectiveSource });
          if (host) {
            params.set("host", host);
          }
          const onDataCenter = typeof window !== "undefined" && /\/data-center\/?$/.test(window.location.pathname);
          if (onDataCenter) {
            params.set("from", "data-center");
          }
          Object.keys(filterSet).forEach((key) => {
            if (filterSet[key] !== ALL$2) {
              params.set(key, filterSet[key]);
            }
          });
          return `${appSubUrl()}/a/acme-command-center-app/servers?${params.toString()}`;
        };
        const drillHref = (scope, host) => inventoryHrefFor(scope, filters, host);
        return {
          sampleEnabled,
          source,
          onSource,
          live,
          liveState,
          liveError,
          connection,
          refreshSeconds,
          brandName,
          brandTagline,
          logoUrl,
          motion,
          canGoLive,
          filters,
          setFilters,
          onChange,
          options,
          data,
          effectiveSource,
          filteredHosts,
          filteredProblems,
          hostByHostname,
          fleet,
          groups,
          utilization,
          filtersActive,
          total,
          available,
          unavailable,
          maintenance,
          stale,
          warning,
          critical,
          totalProblems,
          unacknowledged,
          problemCounts,
          inventoryHrefFor,
          drillHref
        };
      }

      const ALL$1 = "All";
      const fmt$1 = (n) => n.toLocaleString("en-US");
      const pct$1 = (n) => `${n.toFixed(1)}%`;
      function CommandCenterPage({ initialConfig } = {}) {
        const {
          data,
          effectiveSource,
          source,
          onSource,
          connection,
          live,
          liveError,
          sampleEnabled,
          refreshSeconds,
          brandName,
          brandTagline,
          logoUrl,
          motion,
          canGoLive,
          filters,
          setFilters,
          onChange,
          options,
          filteredHosts,
          filteredProblems,
          hostByHostname,
          fleet,
          groups,
          utilization,
          filtersActive,
          total,
          available,
          unavailable,
          maintenance,
          stale,
          warning,
          critical,
          totalProblems,
          unacknowledged,
          problemCounts,
          inventoryHrefFor,
          drillHref
        } = useOpsData(initialConfig);
        const [resource, setResource] = useState("cpu");
        const [problemTab, setProblemTab] = useState("All");
        const [selectedHost, setSelectedHost] = useState(null);
        const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;
        const openHost = (hostname) => {
          const host = hostByHostname.get(hostname);
          if (host) {
            setSelectedHost(host);
          }
        };
        const safeTotal = total || 1;
        const safeProblems = totalProblems || 1;
        const serviceRows = useMemo(
          () => data.businessServices.filter((row) => {
            if (filters.businessService !== ALL$1 && row.name !== filters.businessService) {
              return false;
            }
            if (filters.environment === "PROD") {
              return row.env.includes("PROD") || row.env === "Mixed";
            }
            if (filters.environment === "DR") {
              return row.env.includes("DR") || row.env === "Mixed";
            }
            if (filters.environment === "UAT") {
              return row.env.includes("UAT") || row.env === "Mixed";
            }
            return true;
          }),
          [data.businessServices, filters.businessService, filters.environment]
        );
        const topServers = useMemo(() => {
          if (source === "live") {
            return data.topServers.filter((r) => {
              const h = hostByHostname.get(r.hostname);
              return !h || matchesFilters(h, filters);
            });
          }
          const groupEnv = filters.hostGroup === "Production" ? "PROD" : filters.hostGroup === "Disaster Recovery" ? "DR" : filters.hostGroup === "Development / UAT" ? "UAT" : null;
          return data.topServers.filter(
            (r) => (filters.environment === ALL$1 || r.environment === filters.environment) && (filters.tier === ALL$1 || r.tier === filters.tier) && (!groupEnv || r.environment === groupEnv) && (filters.os === ALL$1 || r.os === filters.os) && (filters.businessService === ALL$1 || r.businessService === filters.businessService)
          );
        }, [data.topServers, filters, source, hostByHostname]);
        const serviceDrillHref = (row) => {
          const environment = row.env === "PROD" || row.env === "DR" || row.env === "UAT" ? row.env : ALL$1;
          return inventoryHrefFor("total", {
            environment,
            tier: ALL$1,
            hostGroup: ALL$1,
            os: ALL$1,
            businessService: row.name
          });
        };
        const drDrillHref = (row) => inventoryHrefFor("total", {
          environment: ALL$1,
          tier: ALL$1,
          hostGroup: ALL$1,
          os: ALL$1,
          businessService: ALL$1,
          ...row.hostFilter || {}
        });
        return /* @__PURE__ */ React.createElement("div", { className: `cc-app${motionAllowed(motion) ? "" : " cc-motion-off"}` }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a1", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a2", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a3", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
          Header,
          {
            filters,
            onChange,
            options,
            source,
            onSource,
            connection,
            version: live?.version,
            hostCount: live?.data.hosts.length,
            lastSync: live?.fetchedAt.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Singapore" }),
            canGoLive,
            sampleEnabled,
            brandName,
            brandTagline,
            logoUrl
          }
        ), /* @__PURE__ */ React.createElement(LiveProblemsTicker, { problems: filteredProblems, onHost: openHost }), source === "live" && connection === "error" ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner" }, /* @__PURE__ */ React.createElement("strong", null, "ZABBIX UNREACHABLE"), /* @__PURE__ */ React.createElement("span", null, liveError || "Unable to reach the Zabbix API."), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { marginLeft: "auto" } }, live ? "Showing last successful sync" : sampleEnabled ? "Showing sample data" : "No live data available")) : null, source === "live" && live && data.hosts.length > 0 && filtersActive && filteredHosts.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner warn" }, /* @__PURE__ */ React.createElement("strong", null, "NO SERVERS MATCH FILTERS"), /* @__PURE__ */ React.createElement("span", null, "Active filters exclude all ", fmt$1(data.hosts.length), " live server", data.hosts.length === 1 ? "" : "s", "."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-banner-btn", onClick: () => setFilters({ ...ALL_FILTERS }) }, "Clear filters")) : null, /* @__PURE__ */ React.createElement("div", { className: "cc-kpis" }, /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "server",
            label: "TOTAL SERVERS",
            value: fmt$1(total),
            sub: filtersActive ? "Filtered inventory" : "Monitored inventory",
            tone: "blue",
            href: drillHref("total")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "check",
            label: "AVAILABLE",
            value: fmt$1(available),
            sub: pct$1(available / safeTotal * 100),
            delta: data.kpiDeltas.available,
            deltaTone: "good",
            tone: "green",
            href: drillHref("available")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "x",
            label: "UNAVAILABLE",
            value: fmt$1(unavailable),
            sub: pct$1(unavailable / safeTotal * 100),
            delta: data.kpiDeltas.unavailable,
            deltaTone: "bad",
            tone: "red",
            href: drillHref("unavailable")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "alert",
            label: "WARNING",
            value: fmt$1(warning),
            sub: pct$1(warning / safeTotal * 100),
            delta: data.kpiDeltas.warning,
            deltaTone: "good",
            tone: "yellow",
            href: drillHref("warning")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "alert",
            label: "CRITICAL",
            value: fmt$1(critical),
            sub: pct$1(critical / safeTotal * 100),
            delta: data.kpiDeltas.critical,
            deltaTone: "bad",
            tone: "red",
            href: drillHref("critical")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "bell",
            label: "TOTAL PROBLEMS",
            value: fmt$1(totalProblems),
            sub: `${fmt$1(unacknowledged)} unacknowledged`,
            tone: "purple",
            href: drillHref("problems")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "bell-off",
            label: "UNACKNOWLEDGED",
            value: fmt$1(unacknowledged),
            sub: pct$1(unacknowledged / safeProblems * 100),
            tone: "orange",
            href: drillHref("unacknowledged")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "wrench",
            label: "IN MAINTENANCE",
            value: fmt$1(maintenance),
            sub: pct$1(maintenance / safeTotal * 100),
            tone: "cyan",
            href: drillHref("maintenance")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "db",
            label: "STALE / NO DATA",
            value: fmt$1(stale),
            sub: pct$1(stale / safeTotal * 100),
            tone: "gray",
            href: drillHref("stale")
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "cc-util-row" }, /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "CPU utilisation",
            sub: "All servers",
            avg: utilization.cpu.avg,
            critical: utilization.cpu.critical,
            warning: utilization.cpu.warning,
            normal: utilization.cpu.normal,
            accent: "#2f9bff"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Memory utilisation",
            sub: "All servers",
            avg: utilization.memory.avg,
            critical: utilization.memory.critical,
            warning: utilization.memory.warning,
            normal: utilization.memory.normal,
            accent: "#8b5cf6"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Disk utilisation",
            sub: "All filesystems",
            avg: utilization.disk.avg,
            critical: utilization.disk.critical,
            warning: utilization.disk.warning,
            normal: utilization.disk.normal,
            accent: "#00d47e"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Network utilisation",
            sub: "All interfaces",
            avg: utilization.network.avg,
            critical: utilization.network.critical,
            warning: utilization.network.warning,
            normal: utilization.network.normal,
            accent: "#00d4ff"
          }
        )), /* @__PURE__ */ React.createElement(GroupGrids, { groups, onSelect: setSelectedHost }), /* @__PURE__ */ React.createElement("div", { className: "cc-bottom" }, /* @__PURE__ */ React.createElement(BusinessServicesTable, { rows: serviceRows, href: serviceDrillHref }), /* @__PURE__ */ React.createElement(DrTable, { rows: data.drComponents, href: drDrillHref }), /* @__PURE__ */ React.createElement(TopServersPanel, { rows: topServers, resource, onResource: setResource, onHost: openHost })), /* @__PURE__ */ React.createElement(
          ProblemsTable,
          {
            problems: filteredProblems,
            tab: problemTab,
            onTab: setProblemTab,
            counts: problemCounts,
            source: effectiveSource,
            refreshSeconds,
            onHost: openHost
          }
        ), activeHost ? /* @__PURE__ */ React.createElement(
          HostDetailModal,
          {
            host: activeHost,
            problems: data.problems,
            fleet,
            source: effectiveSource,
            inventoryHref: drillHref("total", activeHost.hostname),
            onClose: () => setSelectedHost(null)
          }
        ) : null);
      }

      const fmt = (n) => n.toLocaleString("en-US");
      const pct = (n) => `${n.toFixed(1)}%`;
      function DataCenterPage({ initialConfig } = {}) {
        const {
          data,
          effectiveSource,
          source,
          onSource,
          connection,
          live,
          liveError,
          sampleEnabled,
          refreshSeconds,
          brandName,
          brandTagline,
          logoUrl,
          motion,
          canGoLive,
          filters,
          setFilters,
          onChange,
          options,
          filteredHosts,
          filteredProblems,
          hostByHostname,
          fleet,
          groups,
          filtersActive,
          total,
          available,
          unavailable,
          maintenance,
          totalProblems,
          drillHref
        } = useOpsData(initialConfig);
        const [problemTab, setProblemTab] = useState("All");
        const [selectedHost, setSelectedHost] = useState(null);
        const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;
        const openHost = (hostname) => {
          const host = hostByHostname.get(hostname);
          if (host) {
            setSelectedHost(host);
          }
        };
        const safeTotal = total || 1;
        const safeProblems = totalProblems || 1;
        const envGroups = groups.filter((group) => group.key === "PROD" || group.key === "DR");
        const unacknowledgedProblems = filteredProblems.filter(
          (p) => !p.ack && p.severityGroup !== "Info"
        );
        const unacknowledgedCounts = {
          All: unacknowledgedProblems.length,
          Critical: unacknowledgedProblems.filter((p) => p.severityGroup === "Critical").length,
          Warning: unacknowledgedProblems.filter((p) => p.severityGroup === "Warning").length,
          Info: unacknowledgedProblems.filter((p) => p.severityGroup === "Info").length
        };
        const safeUnacknowledged = unacknowledgedProblems.length || 1;
        const maintenanceHosts = filteredHosts.filter((h) => h.maintenance);
        return /* @__PURE__ */ React.createElement("div", { className: `cc-app cc-dc${motionAllowed(motion) ? "" : " cc-motion-off"}` }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a1", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a2", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a3", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
          Header,
          {
            filters,
            onChange,
            options,
            source,
            onSource,
            connection,
            version: live?.version,
            hostCount: live?.data.hosts.length,
            lastSync: live?.fetchedAt.toLocaleTimeString("en-GB", {
              hour12: false,
              timeZone: "Asia/Singapore"
            }),
            canGoLive,
            sampleEnabled,
            brandName,
            brandTagline,
            logoUrl,
            title: "DATA CENTER OPERATION COMMAND CENTER",
            subtitle: "Production  |  Disaster Recovery  |  Real-time Data Center Health from Zabbix"
          }
        ), /* @__PURE__ */ React.createElement(LiveProblemsTicker, { problems: unacknowledgedProblems, onHost: openHost }), source === "live" && connection === "error" ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner" }, /* @__PURE__ */ React.createElement("strong", null, "ZABBIX UNREACHABLE"), /* @__PURE__ */ React.createElement("span", null, liveError || "Unable to reach the Zabbix API."), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { marginLeft: "auto" } }, live ? "Showing last successful sync" : sampleEnabled ? "Showing sample data" : "No live data available")) : null, source === "live" && live && data.hosts.length > 0 && filtersActive && filteredHosts.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner warn" }, /* @__PURE__ */ React.createElement("strong", null, "NO SERVERS MATCH FILTERS"), /* @__PURE__ */ React.createElement("span", null, "Active filters exclude all ", fmt(data.hosts.length), " live server", data.hosts.length === 1 ? "" : "s", "."), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "cc-banner-btn",
            onClick: () => setFilters({ ...filters, environment: "All", tier: "All", hostGroup: "All", os: "All", businessService: "All" })
          },
          "Clear filters"
        )) : null, /* @__PURE__ */ React.createElement("div", { className: "cc-kpis" }, /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "server",
            label: "TOTAL SERVERS",
            value: fmt(total),
            sub: filtersActive ? "Filtered inventory" : "Monitored inventory",
            tone: "blue",
            href: drillHref("total")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "check",
            label: "AVAILABLE",
            value: fmt(available),
            sub: pct(available / safeTotal * 100),
            delta: data.kpiDeltas.available,
            deltaTone: "good",
            tone: "green",
            href: drillHref("available")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "x",
            label: "UNAVAILABLE",
            value: fmt(unavailable),
            sub: pct(unavailable / safeTotal * 100),
            delta: data.kpiDeltas.unavailable,
            deltaTone: "bad",
            tone: "red",
            href: drillHref("unavailable")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "alert",
            label: "WARNING",
            value: fmt(unacknowledgedCounts.Warning),
            sub: `${pct(unacknowledgedCounts.Warning / safeUnacknowledged * 100)} unacknowledged`,
            tone: "yellow",
            href: drillHref("warning")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "alert",
            label: "CRITICAL",
            value: fmt(unacknowledgedCounts.Critical),
            sub: `${pct(unacknowledgedCounts.Critical / safeUnacknowledged * 100)} unacknowledged`,
            tone: "red",
            href: drillHref("critical")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "bell",
            label: "TOTAL PROBLEMS",
            value: fmt(totalProblems),
            sub: `${fmt(unacknowledgedProblems.length)} unacknowledged`,
            tone: "purple",
            href: drillHref("problems")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "bell-off",
            label: "UNACKNOWLEDGED",
            value: fmt(unacknowledgedProblems.length),
            sub: pct(unacknowledgedProblems.length / safeProblems * 100),
            tone: "orange",
            href: drillHref("unacknowledged")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "wrench",
            label: "IN MAINTENANCE",
            value: fmt(maintenance),
            sub: pct(maintenance / safeTotal * 100),
            tone: "cyan",
            href: drillHref("maintenance")
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "cc-dc-envs" }, envGroups.map((group) => /* @__PURE__ */ React.createElement(GroupPanel, { key: group.key, group, onSelect: setSelectedHost })), /* @__PURE__ */ React.createElement(MaintenanceTable, { hosts: maintenanceHosts, onHost: openHost })), /* @__PURE__ */ React.createElement(
          ProblemsTable,
          {
            problems: unacknowledgedProblems,
            tab: problemTab,
            onTab: setProblemTab,
            counts: unacknowledgedCounts,
            source: effectiveSource,
            refreshSeconds,
            onHost: openHost,
            title: "Unacknowledged Problems",
            tabs: ["All", "Critical", "Warning"]
          }
        ), activeHost ? /* @__PURE__ */ React.createElement(
          HostDetailModal,
          {
            host: activeHost,
            problems: data.problems,
            fleet,
            source: effectiveSource,
            inventoryHref: drillHref("total", activeHost.hostname),
            onClose: () => setSelectedHost(null)
          }
        ) : null);
      }

      var __defProp = Object.defineProperty;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
      class ErrorBoundary extends React.Component {
        constructor() {
          super(...arguments);
          __publicField(this, "state", { error: null });
        }
        static getDerivedStateFromError(error) {
          return { error };
        }
        componentDidCatch(error, info) {
          console.error("OpsBeacon dashboard render failed", error, info.componentStack);
        }
        render() {
          const { error } = this.state;
          if (!error) {
            return this.props.children;
          }
          return /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background: "#04080f",
                color: "#dbe7f5",
                fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }
            },
            /* @__PURE__ */ React.createElement(
              "div",
              {
                style: {
                  maxWidth: "720px",
                  width: "100%",
                  padding: "22px 24px",
                  border: "1px solid #5b1c26",
                  borderRadius: "14px",
                  background: "linear-gradient(180deg, rgba(40, 12, 18, 0.9), rgba(12, 8, 14, 0.95))",
                  boxShadow: "0 18px 50px -30px rgba(255, 61, 87, 0.6)"
                }
              },
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  style: {
                    color: "#ff4d67",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    marginBottom: "10px"
                  }
                },
                "DASHBOARD RENDER ERROR"
              ),
              /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" } }, "The dashboard hit an unexpected error and stopped rendering. The Zabbix data connection is unaffected; reloading restores the dashboard."),
              /* @__PURE__ */ React.createElement(
                "pre",
                {
                  style: {
                    margin: "0 0 16px",
                    padding: "10px 12px",
                    maxHeight: "180px",
                    overflow: "auto",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.35)",
                    color: "#ffb3bf",
                    fontSize: "11px",
                    whiteSpace: "pre-wrap"
                  }
                },
                error.message || String(error)
              ),
              /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px" } }, /* @__PURE__ */ React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => window.location.reload(),
                  style: {
                    appearance: "none",
                    cursor: "pointer",
                    padding: "8px 14px",
                    border: "1px solid rgba(255, 77, 103, 0.4)",
                    borderRadius: "8px",
                    background: "rgba(255, 61, 87, 0.14)",
                    color: "#ffd7dd",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "inherit"
                  }
                },
                "Reload dashboard"
              ), /* @__PURE__ */ React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => this.setState({ error: null }),
                  style: {
                    appearance: "none",
                    cursor: "pointer",
                    padding: "8px 14px",
                    border: "1px solid rgba(96, 165, 250, 0.28)",
                    borderRadius: "8px",
                    background: "rgba(47, 155, 255, 0.1)",
                    color: "#cfe3ff",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "inherit"
                  }
                },
                "Try again"
              ))
            )
          );
        }
      }

      const ALL = "All";
      const PAGE_SIZES = [25, 50, 100, 250];
      const ALL_FILTERS$1 = {
        environment: ALL,
        tier: ALL,
        hostGroup: ALL,
        os: ALL,
        businessService: ALL
      };
      const SCOPE_META = {
        total: { title: "All monitored servers", blurb: "Every monitored host matching the active filters." },
        available: {
          title: "Available servers",
          blurb: "Servers that are not unavailable, not in maintenance and not stale."
        },
        unavailable: {
          title: "Unavailable servers",
          blurb: "The host or one of its interfaces is reported as unavailable by Zabbix."
        },
        warning: {
          title: "Servers in warning",
          blurb: "The highest active trigger priority is Warning or Average (2\u20133)."
        },
        critical: {
          title: "Servers in critical",
          blurb: "The highest active trigger priority is High or Disaster (4\u20135)."
        },
        problems: {
          title: "Servers with active problems",
          blurb: "Servers with at least one active Zabbix problem.",
          problems: "all"
        },
        unacknowledged: {
          title: "Servers with unacknowledged problems",
          blurb: "Servers with at least one active problem that has not been acknowledged.",
          problems: "unack"
        },
        maintenance: { title: "Servers in maintenance", blurb: "Hosts currently inside a Zabbix maintenance window." },
        stale: {
          title: "Servers with stale / no data",
          blurb: "Newest item value lags the freshest item in the estate by 5\u201310 minutes (stale) or more than 10 minutes (no data)."
        }
      };
      const HEALTH_CLASS = {
        healthy: "cc-h-healthy",
        warning: "cc-h-warning",
        critical: "cc-h-critical",
        stale: "cc-h-stale",
        maintenance: "cc-h-maintenance",
        unavailable: "cc-h-unavailable"
      };
      const DATA_STATE_LABEL = {
        upToDate: "Up to date",
        stale: "Stale",
        noData: "No data",
        notMonitored: "Not monitored"
      };
      const SRV_CSS = `
.cc-srv { padding-top: 18px; }
.cc-srv-head { display: flex; gap: 16px 22px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 16px; }
.cc-srv-brand { display: flex; gap: 13px; align-items: flex-start; min-width: 0; }
.cc-srv-titles { min-width: 260px; }
.cc-srv-back {
  display: inline-flex; align-items: center; gap: 6px; color: #9bd0ff; text-decoration: none;
  font-size: 11.5px; font-weight: 600; padding: 7px 11px; border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 8px; background: rgba(10, 20, 36, 0.62); white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.cc-srv-back:hover { border-color: rgba(127, 196, 255, 0.5); color: #fff; background: rgba(47, 155, 255, 0.12); }
.cc-srv-title {
  margin: 4px 0 5px; font-size: clamp(22px, 1.75vw, 28px); font-weight: 700;
  letter-spacing: 0.045em; line-height: 1.12;
  background: linear-gradient(90deg, #9bd0ff 0%, #e8f4ff 24%, #c4b5fd 50%, #7fc4ff 76%, #9bd0ff 100%);
  background-size: 220% 100%; -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
  animation: cc-title-shine 9s linear infinite;
}
.cc-srv-sub { font-size: 12px; line-height: 1.45; color: #9fb3cc; margin-top: 5px; max-width: 820px; }
.cc-srv-sub strong { color: #dbe7f5; }
.cc-srv-actions { margin-left: auto; display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }
.cc-srv-btn {
  appearance: none; font-family: inherit; cursor: pointer; font-size: 10.5px; font-weight: 600;
  color: #dbe7f5; background: rgba(10, 20, 36, 0.62); border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 7px; padding: 7px 11px; letter-spacing: 0.02em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;
}
.cc-srv-btn:hover { border-color: rgba(127, 196, 255, 0.5); background: rgba(47, 155, 255, 0.12); color: #fff; }
.cc-srv-btn:disabled { opacity: 0.45; cursor: default; }
.cc-srv-badge {
  font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; padding: 3px 8px;
  border-radius: 5px; border: 1px solid rgba(148, 184, 230, 0.24); color: #9fb3cc;
}
.cc-srv-badge.live { color: #00e676; border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-srv-badge.sample { color: #ffc107; border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); }
.cc-srv-filters {
  display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 14px;
  padding: 12px 14px; border: 1px solid rgba(96, 165, 250, 0.16); border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.7), rgba(7, 14, 26, 0.8));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -34px rgba(0, 80, 180, 0.9);
}
.cc-srv-search { min-width: 230px; display: flex; flex-direction: column; gap: 3px; }
.cc-srv-search label {
  display: block; font-size: 9.5px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.09em; color: #9fb3cc; margin: 0;
}
.cc-srv-search input {
  width: 100%; height: 26px; background-color: rgba(6, 12, 22, 0.85);
  border: 1px solid rgba(148, 184, 230, 0.22); color: #dbe7f5;
  border-radius: 7px; padding: 0 9px; font-size: 11.5px; outline: none;
}
.cc-srv-search input::placeholder { color: #6c82a0; }
.cc-srv-search input:focus { border-color: #2f9bff; box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.18); }
.cc-srv-hostchip {
  display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; color: #9fb3cc;
  background: rgba(10, 20, 36, 0.62); border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 7px; padding: 5px 6px 5px 9px;
}
.cc-srv-hostchip strong { color: #dbe7f5; }
.cc-srv-hostchip button {
  appearance: none; border: 0; background: transparent; color: #7fc4ff; cursor: pointer;
  font-size: 14px; line-height: 1; padding: 0 2px; font-family: inherit;
}
.cc-srv-table { font-size: 11.5px; }
.cc-srv-table td { padding: 7px 8px; }
.cc-srv-table .hostname { color: #e6f0fb; font-weight: 700; }
.cc-srv-health { font-weight: 800; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.2px; }
.cc-h-healthy { color: #00d47e; }
.cc-h-warning { color: #ffc107; }
.cc-h-critical { color: #ff3b30; }
.cc-h-stale { color: #8f9298; }
.cc-h-maintenance { color: #22d3ee; }
.cc-h-unavailable { color: #a855f7; }
.cc-srv-util { text-align: right; font-variant-numeric: tabular-nums; }
.cc-srv-util.hot { color: #ff3b30; font-weight: 700; }
.cc-srv-util.warm { color: #ffc107; }
.cc-srv-problem { max-width: 340px; overflow: hidden; text-overflow: ellipsis; }
.cc-srv-pager {
  display: flex; align-items: center; gap: 12px; justify-content: flex-end; flex-wrap: wrap;
  padding: 10px 4px 0; margin-top: 4px; border-top: 1px solid rgba(20, 37, 60, 0.8);
  color: #9fb3cc; font-size: 10.5px;
}
.cc-srv-pager > span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
/* Explicit sizing: Grafana's global select rules made this control full-width
   and very thin inside the flex pager. The arrow is drawn here so the height
   matches the Prev / Next buttons. */
.cc-srv-pager > span > select {
  -webkit-appearance: none; appearance: none;
  width: 74px; flex: 0 0 74px; height: 27px;
  box-sizing: border-box;
  padding: 0 24px 0 9px;
  font-family: inherit; font-size: 11px; font-weight: 600; line-height: 25px;
  color: #dbe7f5;
  background-color: rgba(10, 20, 36, 0.62);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%237fc4ff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 9px 6px;
  border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 7px;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.18s ease, background-color 0.18s ease;
}
.cc-srv-pager > span > select:hover {
  border-color: rgba(127, 196, 255, 0.5);
  background-color: rgba(47, 155, 255, 0.12);
}
.cc-srv-pager > span > select:focus-visible {
  outline: 2px solid rgba(127, 196, 255, 0.7);
  outline-offset: 1px;
}
.cc-srv-pager > span > select option { background: #0b1626; color: #dbe7f5; }
.cc-srv-empty { padding: 34px 20px; text-align: center; color: #9fb3cc; font-size: 12px; }
.cc-srv-error { color: #ffb3bf; }

@media (max-width: 900px) {
  .cc-srv-brand { flex-wrap: wrap; }
  .cc-srv-actions { margin-left: 0; }
}
`;
      function queryParam(query, key) {
        const value = query ? query[key] : void 0;
        if (Array.isArray(value)) {
          return value.length ? String(value[0]) : null;
        }
        if (value !== void 0 && value !== null) {
          return String(value);
        }
        if (typeof window !== "undefined") {
          return new URLSearchParams(window.location.search).get(key);
        }
        return null;
      }
      function parseScope(value) {
        return value && Object.prototype.hasOwnProperty.call(SCOPE_META, value) ? value : "total";
      }
      function parseFilters(query) {
        const pick = (key, allowed) => {
          const value = queryParam(query, key);
          return value && (!allowed || allowed.includes(value)) ? value : ALL;
        };
        return {
          environment: pick("environment", ["PROD", "DR", "UAT"]),
          tier: pick("tier", ["Tier 1", "Tier 2", "Tier 3"]),
          hostGroup: pick("hostGroup"),
          os: pick("os"),
          businessService: pick("businessService")
        };
      }
      function isUnavailable(host) {
        return host.connectivity === "unavailable";
      }
      function inScope(host, scope, problems) {
        switch (scope) {
          case "total":
            return true;
          case "available":
            return !isUnavailable(host) && !host.maintenance && !host.stale;
          case "unavailable":
            return isUnavailable(host);
          case "warning":
            return host.severity === "warning";
          case "critical":
            return host.severity === "critical";
          case "problems":
            return problems.length > 0;
          case "unacknowledged":
            return problems.some((p) => !p.ack);
          case "maintenance":
            return host.maintenance;
          case "stale":
            return host.stale;
          default:
            return true;
        }
      }
      function utilClass(value) {
        if (value >= 90) {
          return "cc-srv-util hot";
        }
        if (value >= 70) {
          return "cc-srv-util warm";
        }
        return "cc-srv-util";
      }
      function csvCell(value) {
        let text = String(value);
        if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
          text = `'${text}`;
        }
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
      }
      function ServerListPage({
        query,
        initialConfig
      }) {
        const scope = useMemo(() => parseScope(queryParam(query, "scope")), [query]);
        const origin = useMemo(
          () => queryParam(query, "from") === "data-center" ? "data-center" : "command-center",
          [query]
        );
        const backLabel = origin === "data-center" ? "Data Center Ops" : "Command Center";
        const requestedSource = queryParam(query, "source") === "live" ? "live" : "sample";
        const canGoLive = useMemo(() => isGrafanaHosted(), []);
        const [sampleEnabled, setSampleEnabled] = useState(
          initialConfig ? initialConfig.sampleDataEnabled : true
        );
        const [refreshSeconds, setRefreshSeconds] = useState(
          initialConfig ? initialConfig.refreshSeconds : DEFAULT_ZABBIX_CONFIG.refreshSeconds
        );
        const [brandName, setBrandName] = useState(
          initialConfig ? initialConfig.brandName : DEFAULT_ZABBIX_CONFIG.brandName
        );
        const [brandTagline, setBrandTagline] = useState(
          initialConfig ? initialConfig.brandTagline : DEFAULT_ZABBIX_CONFIG.brandTagline
        );
        const [logoUrl, setLogoUrl] = useState(
          initialConfig ? initialConfig.logoUrl : DEFAULT_ZABBIX_CONFIG.logoUrl
        );
        const [motion, setMotion] = useState(
          initialConfig ? initialConfig.motion : DEFAULT_ZABBIX_CONFIG.motion
        );
        useEffect(() => {
          if (!canGoLive) {
            return;
          }
          let cancelled = false;
          loadZabbixConfig().then((config) => {
            if (!cancelled) {
              setSampleEnabled(config.sampleDataEnabled);
              setRefreshSeconds(config.refreshSeconds);
              setBrandName(config.brandName);
              setBrandTagline(config.brandTagline);
              setLogoUrl(config.logoUrl);
              setMotion(config.motion);
            }
          }).catch(() => {
          });
          return () => {
            cancelled = true;
          };
        }, [canGoLive]);
        const source = resolveSource(requestedSource, canGoLive, sampleEnabled);
        const sample = useMemo(() => buildSampleData(), []);
        const [live, setLive] = useState(null);
        const [liveState, setLiveState] = useState(
          source === "live" ? "loading" : "ready"
        );
        const [liveError, setLiveError] = useState(null);
        const [tick, setTick] = useState(0);
        const liveRef = useRef(null);
        const fetchingRef = useRef(false);
        useEffect(() => {
          if (source !== "live" || fetchingRef.current) {
            return;
          }
          let cancelled = false;
          fetchingRef.current = true;
          if (!liveRef.current) {
            setLiveState("loading");
          }
          setLiveError(null);
          fetchLiveData().then((result) => {
            if (!cancelled) {
              liveRef.current = result;
              setLive(result);
              setLiveState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setLiveError(err.message || "Unable to reach the Zabbix API");
              setLiveState("error");
            }
          }).finally(() => {
            fetchingRef.current = false;
          });
          return () => {
            cancelled = true;
          };
        }, [source, tick]);
        useEffect(() => {
          if (source !== "live") {
            return;
          }
          const timer = window.setInterval(() => setTick((t) => t + 1), refreshSeconds * 1e3);
          return () => window.clearInterval(timer);
        }, [source, refreshSeconds]);
        const data = source === "live" ? live ? live.data : null : sample;
        const staleSampleLink = useRef(
          requestedSource === "sample" && !(initialConfig ? initialConfig.sampleDataEnabled : true)
        );
        const [filters, setFilters] = useState(
          () => staleSampleLink.current ? { ...ALL_FILTERS$1 } : parseFilters(query)
        );
        const [hostFilter, setHostFilter] = useState(
          () => staleSampleLink.current ? null : queryParam(query, "host")
        );
        useEffect(() => {
          if (!sampleEnabled && requestedSource === "sample" && !staleSampleLink.current) {
            staleSampleLink.current = true;
            setFilters({ ...ALL_FILTERS$1 });
            setHostFilter(null);
          }
        }, [sampleEnabled, requestedSource]);
        const [search, setSearch] = useState("");
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(50);
        const [selectedHost, setSelectedHost] = useState(null);
        const hosts = data ? data.hosts : [];
        const problems = data ? data.problems : [];
        const filteredHosts = useMemo(() => hosts.filter((h) => matchesFilters(h, filters)), [hosts, filters]);
        const hostByHostname = useMemo(() => new Map(hosts.map((h) => [h.hostname, h])), [hosts]);
        const fleet = useMemo(() => {
          const count = filteredHosts.length;
          const average = (key) => count ? filteredHosts.reduce((sum, h) => sum + h[key], 0) / count : 0;
          return {
            cpu: average("cpu"),
            memory: average("memory"),
            disk: average("disk"),
            network: average("network"),
            hosts: count
          };
        }, [filteredHosts]);
        const activeHost = selectedHost ? hosts.find((h) => h.id === selectedHost.id) || null : null;
        const filteredProblems = useMemo(
          () => problems.filter((p) => {
            const host = hostByHostname.get(p.hostname);
            return !!host && matchesFilters(host, filters);
          }),
          [problems, hostByHostname, filters]
        );
        const problemsByHost = useMemo(() => {
          const map = /* @__PURE__ */ new Map();
          for (const problem of filteredProblems) {
            const list = map.get(problem.hostname) || [];
            list.push(problem);
            map.set(problem.hostname, list);
          }
          return map;
        }, [filteredProblems]);
        const scopedHosts = useMemo(() => {
          const list = filteredHosts.filter((h) => inScope(h, scope, problemsByHost.get(h.hostname) || []));
          const countFor = (h) => (problemsByHost.get(h.hostname) || []).length;
          const sorted = list.slice();
          if (scope === "problems" || scope === "unacknowledged" || scope === "warning" || scope === "critical") {
            sorted.sort((a, b) => countFor(b) - countFor(a) || a.hostname.localeCompare(b.hostname));
          } else if (scope === "stale") {
            sorted.sort((a, b) => b.lastSeenMin - a.lastSeenMin || a.hostname.localeCompare(b.hostname));
          } else {
            sorted.sort((a, b) => a.hostname.localeCompare(b.hostname));
          }
          return sorted;
        }, [filteredHosts, scope, problemsByHost]);
        const hostScoped = useMemo(
          () => hostFilter ? scopedHosts.filter((h) => h.hostname === hostFilter) : scopedHosts,
          [scopedHosts, hostFilter]
        );
        const visibleHosts = useMemo(() => {
          const needle = search.trim().toLowerCase();
          if (!needle) {
            return hostScoped;
          }
          return hostScoped.filter(
            (h) => [h.hostname, h.hostGroup, h.businessService, h.os, h.environment, h.tier].join(" ").toLowerCase().includes(needle)
          );
        }, [hostScoped, search]);
        const pageCount = Math.max(1, Math.ceil(visibleHosts.length / pageSize));
        const currentPage = Math.min(page, pageCount);
        const pageRows = visibleHosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const scopeProblems = scope === "problems" ? filteredProblems : scope === "unacknowledged" ? filteredProblems.filter((p) => !p.ack) : [];
        const groupOptions = useMemo(
          () => Array.from(new Set(hosts.map((h) => h.hostGroup))).sort((a, b) => a.localeCompare(b)),
          [hosts]
        );
        const osOptions = useMemo(
          () => Array.from(new Set(hosts.map((h) => h.os))).sort((a, b) => a.localeCompare(b)),
          [hosts]
        );
        const serviceOptions = useMemo(
          () => Array.from(new Set(hosts.map((h) => h.businessService))).sort((a, b) => a.localeCompare(b)),
          [hosts]
        );
        const changeFilter = (key, value) => {
          const next = { ...filters, [key]: value };
          setFilters(next);
          setPage(1);
          if (typeof window !== "undefined" && window.history) {
            const params = new URLSearchParams(window.location.search);
            Object.entries(next).forEach(([name, val]) => {
              if (val && val !== ALL) {
                params.set(name, val);
              } else {
                params.delete(name);
              }
            });
            window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
          }
        };
        const clearHostFilter = () => {
          setHostFilter(null);
          setPage(1);
          if (typeof window !== "undefined" && window.history) {
            const params = new URLSearchParams(window.location.search);
            params.delete("host");
            window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
          }
        };
        const resetFilters = () => {
          setFilters({ environment: ALL, tier: ALL, hostGroup: ALL, os: ALL, businessService: ALL });
          setHostFilter(null);
          setSearch("");
          setPage(1);
          if (typeof window !== "undefined" && window.history) {
            const params = new URLSearchParams(window.location.search);
            ["environment", "tier", "hostGroup", "os", "businessService", "host"].forEach(
              (key) => params.delete(key)
            );
            window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
          }
        };
        const backParams = new URLSearchParams({ source });
        Object.keys(filters).forEach((key) => {
          if (filters[key] !== ALL) {
            backParams.set(key, filters[key]);
          }
        });
        const backTarget = origin === "data-center" ? "/data-center" : "/command-center";
        const backHref = `${appSubUrl()}/a/acme-command-center-app${backTarget}?${backParams.toString()}`;
        const exportCsv = () => {
          if (typeof document === "undefined") {
            return;
          }
          const header2 = [
            "Hostname",
            "Environment",
            "Tier",
            "Host group",
            "OS",
            "Business service",
            "Health",
            "Data state",
            "Last seen (min)",
            "CPU %",
            "Memory %",
            "Disk %",
            "Network %",
            "Active problems",
            "Unacknowledged",
            "Latest problem"
          ];
          const rows = visibleHosts.map((h) => {
            const hostProblems = problemsByHost.get(h.hostname) || [];
            const latest = hostProblems.slice().sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
            return [
              h.hostname,
              h.environment,
              h.tier,
              h.hostGroup,
              h.os,
              h.businessService,
              h.health,
              DATA_STATE_LABEL[h.dataState],
              h.lastSeenMin >= 9999 ? "" : h.lastSeenMin,
              h.cpu,
              h.memory,
              h.disk,
              h.network,
              hostProblems.length,
              hostProblems.filter((p) => !p.ack).length,
              latest ? `${latest.severity}: ${latest.problem}` : ""
            ].map(csvCell);
          });
          const csv = [header2.map(csvCell).join(","), ...rows.map((r) => r.join(","))].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `servers-${scope}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        };
        const meta = SCOPE_META[scope];
        const sourceBadge = source === "live" ? "LIVE" : "SAMPLE";
        const header = /* @__PURE__ */ React.createElement("div", { className: "cc-srv-head" }, /* @__PURE__ */ React.createElement("a", { className: "cc-srv-back", href: backHref }, "\u2190 ", backLabel), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-brand" }, /* @__PURE__ */ React.createElement(BrandMark, { logoUrl }), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-titles" }, /* @__PURE__ */ React.createElement("div", { className: "cc-eyebrow" }, brandName, " ", /* @__PURE__ */ React.createElement("span", null, "\xB7"), " ", brandTagline), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-title" }, "SERVER INVENTORY"), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-sub" }, /* @__PURE__ */ React.createElement("strong", null, meta.title), " \u2014 ", meta.blurb, " ", scopeProblems.length > 0 || meta.problems ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, scopeProblems.length), " problem", scopeProblems.length === 1 ? "" : "s", " across", " ", /* @__PURE__ */ React.createElement("strong", null, visibleHosts.length), " server", visibleHosts.length === 1 ? "" : "s", ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, visibleHosts.length), " server", visibleHosts.length === 1 ? "" : "s", ".")))), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-actions" }, /* @__PURE__ */ React.createElement("span", { className: `cc-srv-badge ${source === "live" ? "live" : "sample"}` }, sourceBadge), live ? /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { fontSize: 9 } }, "sync ", live.fetchedAt.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Singapore" }), source === "live" ? ` \xB7 auto ${refreshSeconds}s` : "") : null, source === "live" ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: () => setTick((t) => t + 1), disabled: liveState === "loading" }, liveState === "loading" ? "Refreshing\u2026" : "Refresh") : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: exportCsv, disabled: !data || visibleHosts.length === 0 }, "Export CSV")));
        const filterBar = /* @__PURE__ */ React.createElement("div", { className: "cc-srv-filters" }, /* @__PURE__ */ React.createElement("div", { className: "cc-filter", style: { minWidth: 120 } }, /* @__PURE__ */ React.createElement("label", null, "Environment"), /* @__PURE__ */ React.createElement("select", { value: filters.environment, onChange: (e) => changeFilter("environment", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), /* @__PURE__ */ React.createElement("option", { value: "PROD" }, "PROD"), /* @__PURE__ */ React.createElement("option", { value: "DR" }, "DR"), /* @__PURE__ */ React.createElement("option", { value: "UAT" }, "DEV / UAT"))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter", style: { minWidth: 110 } }, /* @__PURE__ */ React.createElement("label", null, "System Tier"), /* @__PURE__ */ React.createElement("select", { value: filters.tier, onChange: (e) => changeFilter("tier", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), /* @__PURE__ */ React.createElement("option", { value: "Tier 1" }, "Tier 1"), /* @__PURE__ */ React.createElement("option", { value: "Tier 2" }, "Tier 2"), /* @__PURE__ */ React.createElement("option", { value: "Tier 3" }, "Tier 3"))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter", style: { minWidth: 150 } }, /* @__PURE__ */ React.createElement("label", null, "Host Group"), /* @__PURE__ */ React.createElement("select", { value: filters.hostGroup, onChange: (e) => changeFilter("hostGroup", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), groupOptions.map((g) => /* @__PURE__ */ React.createElement("option", { key: g, value: g }, g)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter", style: { minWidth: 110 } }, /* @__PURE__ */ React.createElement("label", null, "OS Type"), /* @__PURE__ */ React.createElement("select", { value: filters.os, onChange: (e) => changeFilter("os", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), osOptions.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter", style: { minWidth: 160 } }, /* @__PURE__ */ React.createElement("label", null, "Business Service"), /* @__PURE__ */ React.createElement(
          "select",
          {
            value: filters.businessService,
            onChange: (e) => changeFilter("businessService", e.target.value)
          },
          /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"),
          serviceOptions.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s))
        )), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-search" }, /* @__PURE__ */ React.createElement("label", null, "Search"), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "text",
            value: search,
            placeholder: "Hostname, group, service, OS\u2026",
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(1);
            }
          }
        )), hostFilter ? /* @__PURE__ */ React.createElement("span", { className: "cc-srv-hostchip" }, "Host:", " ", hostByHostname.has(hostFilter) ? /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "cc-host-link",
            onClick: () => setSelectedHost(hostByHostname.get(hostFilter) || null)
          },
          hostFilter
        ) : /* @__PURE__ */ React.createElement("strong", null, hostFilter), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: clearHostFilter, "aria-label": "Clear host filter" }, "\xD7")) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: resetFilters }, "Reset"));
        const body = !data ? /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: `cc-srv-empty ${liveState === "error" ? "cc-srv-error" : ""}` }, liveState === "error" ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Could not load live Zabbix data: ", liveError, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: () => setTick((t) => t + 1) }, "Retry"))) : "Loading live data from Zabbix\u2026")) : /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, meta.title), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, visibleHosts.length, " server", visibleHosts.length === 1 ? "" : "s", scopeProblems.length > 0 ? ` \xB7 ${scopeProblems.length} problem${scopeProblems.length === 1 ? "" : "s"}` : "")), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-srv-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Environment"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", null, "Host Group"), /* @__PURE__ */ React.createElement("th", null, "OS"), /* @__PURE__ */ React.createElement("th", null, "Business Service"), /* @__PURE__ */ React.createElement("th", null, "Health"), /* @__PURE__ */ React.createElement("th", null, "Data"), /* @__PURE__ */ React.createElement("th", null, "Last Seen"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "CPU"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Memory"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Disk"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Network"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Problems"), /* @__PURE__ */ React.createElement("th", null, "Latest Problem"))), /* @__PURE__ */ React.createElement("tbody", null, pageRows.map((h, index) => {
          const hostProblems = problemsByHost.get(h.hostname) || [];
          const unack = hostProblems.filter((p) => !p.ack).length;
          const latest = hostProblems.slice().sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
          return /* @__PURE__ */ React.createElement("tr", { key: h.id, className: "cc-srv-row" }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, (currentPage - 1) * pageSize + index + 1), /* @__PURE__ */ React.createElement("td", { className: "hostname" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-host-link", onClick: () => setSelectedHost(h) }, h.hostname)), /* @__PURE__ */ React.createElement("td", null, h.environment), /* @__PURE__ */ React.createElement("td", null, h.tier), /* @__PURE__ */ React.createElement("td", null, h.hostGroup), /* @__PURE__ */ React.createElement("td", null, h.os), /* @__PURE__ */ React.createElement("td", null, h.businessService), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: `cc-srv-health ${HEALTH_CLASS[h.health]}` }, h.health)), /* @__PURE__ */ React.createElement("td", null, DATA_STATE_LABEL[h.dataState]), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, h.lastSeenMin >= 9999 ? "\u2014" : `${h.lastSeenMin}m`), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.cpu) }, h.cpu.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.memory) }, h.memory.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.disk) }, h.disk.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.network) }, h.network.toFixed(1), "%"), /* @__PURE__ */ React.createElement("td", { className: "num" }, hostProblems.length, unack > 0 ? /* @__PURE__ */ React.createElement("span", { className: "cc-muted" }, " (", unack, " unack)") : null), /* @__PURE__ */ React.createElement("td", { className: "cc-srv-problem" }, latest ? /* @__PURE__ */ React.createElement("span", { className: `cc-sev cc-sev-${latest.severity.toLowerCase()}`, title: `${latest.problem} \xB7 ${latest.time} \xB7 ${latest.duration}` }, latest.problem) : /* @__PURE__ */ React.createElement("span", { className: "cc-muted" }, "\u2014")));
        }), pageRows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 16 }, /* @__PURE__ */ React.createElement("div", { className: "cc-srv-empty" }, "No servers match this view and the active filters."))) : null))), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-pager" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", visibleHosts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1, "\u2013", Math.min(currentPage * pageSize, visibleHosts.length), " of ", visibleHosts.length), /* @__PURE__ */ React.createElement("span", null, "Page size", " ", /* @__PURE__ */ React.createElement(
          "select",
          {
            value: pageSize,
            onChange: (e) => {
              setPageSize(parseInt(e.target.value, 10) || 50);
              setPage(1);
            }
          },
          PAGE_SIZES.map((size) => /* @__PURE__ */ React.createElement("option", { key: size, value: size }, size))
        )), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "cc-srv-btn",
            onClick: () => setPage(Math.max(1, currentPage - 1)),
            disabled: currentPage <= 1
          },
          "Prev"
        ), /* @__PURE__ */ React.createElement("span", null, currentPage, " / ", pageCount), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "cc-srv-btn",
            onClick: () => setPage(Math.min(pageCount, currentPage + 1)),
            disabled: currentPage >= pageCount
          },
          "Next"
        )));
        return /* @__PURE__ */ React.createElement("div", { className: `cc-app cc-srv${motionAllowed(motion) ? "" : " cc-motion-off"}` }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("style", null, SRV_CSS), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a1", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a2", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { className: "cc-aurora a3", "aria-hidden": "true" }), header, filterBar, source === "live" && liveState === "error" && live ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner" }, /* @__PURE__ */ React.createElement("strong", null, "ZABBIX UNREACHABLE"), /* @__PURE__ */ React.createElement("span", null, liveError || "Unable to reach the Zabbix API."), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { marginLeft: "auto" } }, "Showing last successful sync")) : null, body, activeHost ? /* @__PURE__ */ React.createElement(
          HostDetailModal,
          {
            host: activeHost,
            problems,
            fleet,
            source,
            onClose: () => setSelectedHost(null)
          }
        ) : null);
      }

      const MAX_LOGO_BYTES = 256 * 1024;
      const LOGO_TYPES = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
      const CFG_CSS = `
.cc-cfg {
  max-width: 820px;
  color: var(--text-color, #d8d9da);
  font-size: 14px;
  line-height: 1.45;
}
.cc-cfg h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 4px 0 6px;
  color: var(--text-color, #d8d9da);
}
.cc-cfg-intro {
  margin: 0 0 18px;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg fieldset {
  border: 1px solid var(--border-weak, #34363e);
  border-radius: 4px;
  margin: 0 0 16px;
  padding: 12px 16px 14px;
}
.cc-cfg legend {
  padding: 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg label {
  display: block;
  margin: 10px 0 4px;
  font-weight: 500;
}
.cc-cfg label.inline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  margin: 8px 0;
}
.cc-cfg input[type="text"],
.cc-cfg input[type="password"],
.cc-cfg input[type="number"],
.cc-cfg select {
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  padding: 6px 9px;
  border: 1px solid var(--border-medium, #4a4d57);
  border-radius: 2px;
  background: var(--input-background, #111217);
  color: var(--text-color, #d8d9da);
  font-size: 14px;
}
/* Grafana's global stylesheet contains a select, input[type="file"] rule with
   height: 4px and line-height: 4 (used for its file-input trick). It wins over
   the natural height here, collapsing every select on this page to a sliver
   with the option text clipped. Restore a normal control height and line box. */
.cc-cfg select {
  height: 36px;
  padding: 0 9px;
  line-height: normal;
}
.cc-cfg select option {
  background: var(--input-background, #111217);
  color: var(--text-color, #d8d9da);
}
.cc-cfg input[type="number"] {
  max-width: 140px;
}
.cc-cfg input:focus,
.cc-cfg select:focus {
  outline: 2px solid var(--primary, #3d71d9);
  outline-offset: -1px;
}
.cc-cfg .help {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg code {
  background: var(--code-background, #1b1d23);
  padding: 1px 5px;
  border-radius: 2px;
  font-size: 12px;
}
.cc-cfg-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 6px 0 4px;
}
.cc-cfg-logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 56px;
  padding: 7px;
  border: 1px dashed var(--border-weak, #34363e);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
}
.cc-cfg-logo-preview img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.cc-cfg-logo-preview span { color: var(--text-color-secondary, #9da5b3); font-size: 11px; }
.cc-cfg-logo-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.cc-cfg-file {
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 0 !important;
  padding: 6px 12px;
  border: 1px solid var(--border-weak, #34363e);
  border-radius: 4px;
  background: var(--button-background, #2e3035);
  color: var(--text-color, #d8d9da);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.cc-cfg-file:hover { border-color: var(--border-medium, #5a5d67); }
.cc-cfg-file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.cc-cfg-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}
.cc-cfg button {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--primary, #3d71d9);
  color: #fff;
}
.cc-cfg button.secondary {
  background: transparent;
  border-color: var(--border-medium, #4a4d57);
  color: var(--text-color, #d8d9da);
}
.cc-cfg button:disabled {
  opacity: 0.55;
  cursor: default;
}
.cc-cfg .status {
  margin-top: 14px;
  padding: 9px 12px;
  border-radius: 3px;
  border-left: 3px solid;
  font-size: 13px;
}
.cc-cfg .status.ok { border-color: #00b36b; background: rgba(0, 179, 107, 0.1); }
.cc-cfg .status.error { border-color: #e0226e; background: rgba(224, 34, 110, 0.1); }
.cc-cfg .status.info { border-color: #3d71d9; background: rgba(61, 113, 217, 0.1); }
.cc-cfg .warn {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 3px;
  background: rgba(255, 176, 32, 0.1);
  border-left: 3px solid #ffb020;
  font-size: 12px;
  color: var(--text-color-secondary, #d8d9da);
}
.cc-cfg .endpoint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-color-secondary, #9da5b3);
  word-break: break-all;
}
`;
      function ZabbixConfigPage({ plugin }) {
        const [config, setConfig] = useState(
          () => normalizeConfig(plugin && plugin.meta?.jsonData || DEFAULT_ZABBIX_CONFIG)
        );
        const [status, setStatus] = useState(null);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);
        useEffect(() => {
          let cancelled = false;
          loadZabbixConfig(true).then((loaded) => {
            if (!cancelled) {
              setConfig(loaded);
            }
          }).catch(() => {
          });
          return () => {
            cancelled = true;
          };
        }, []);
        const patch = (partial) => {
          setConfig((prev) => ({ ...prev, ...partial }));
          setStatus(null);
        };
        const onLogoFile = (event) => {
          const input = event.target;
          const file = input.files && input.files[0];
          input.value = "";
          if (!file) {
            return;
          }
          if (!/^image\/(png|jpe?g|gif|webp|svg\+xml)$/i.test(file.type)) {
            setStatus({ tone: "error", text: "Unsupported logo format. Use PNG, SVG, JPEG, WebP or GIF." });
            return;
          }
          if (file.size > MAX_LOGO_BYTES) {
            setStatus({
              tone: "error",
              text: `Logo is ${Math.round(file.size / 1024)} KB; the limit is 256 KB.`
            });
            return;
          }
          const reader = new FileReader();
          reader.onload = () => patch({ logoUrl: String(reader.result || "") });
          reader.onerror = () => setStatus({ tone: "error", text: "Could not read the selected file." });
          reader.readAsDataURL(file);
        };
        const endpoint = useMemo(() => zabbixEndpoint(config, "api"), [config]);
        const insecureHttpEndpoint = config.transport === "direct" && /^http:\/\//i.test(endpoint) && !/^http:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i.test(endpoint);
        const proxyBase = appSubUrl() || "";
        const onSave = async () => {
          setSaving(true);
          setStatus(null);
          try {
            const saved = await saveZabbixConfig(config);
            setConfig(saved);
            const adjusted = saved.refreshSeconds !== config.refreshSeconds;
            setStatus({
              tone: "ok",
              text: adjusted ? `Settings saved. The refresh interval was adjusted to ${saved.refreshSeconds} s (allowed range 15\u20133600 s). The Command Center and Server Inventory apply them on their next load.` : "Connection settings saved. The Command Center and Server Inventory apply them on their next load; reload an open page to switch to a new refresh interval."
            });
          } catch (err) {
            setStatus({ tone: "error", text: `Could not save settings: ${err.message}` });
          } finally {
            setSaving(false);
          }
        };
        const onTest = async () => {
          setTesting(true);
          setStatus({ tone: "info", text: "Contacting Zabbix\u2026" });
          try {
            const result = await testZabbixConnection(config);
            setStatus({
              tone: "ok",
              text: `Connected to Zabbix ${result.version} \u2014 ${result.hostCount} monitored host${result.hostCount === 1 ? "" : "s"} at ${result.endpoint} as ${result.account}.`
            });
          } catch (err) {
            setStatus({ tone: "error", text: `Connection test failed: ${err.message}` });
          } finally {
            setTesting(false);
          }
        };
        return /* @__PURE__ */ React.createElement("div", { className: "cc-cfg" }, /* @__PURE__ */ React.createElement("style", null, CFG_CSS), /* @__PURE__ */ React.createElement("h2", null, "Zabbix connection"), /* @__PURE__ */ React.createElement("p", { className: "cc-cfg-intro" }, "These settings are stored in Grafana plugin settings for this organisation and are used by the Command Center dashboard to load live data. The sample dataset is unaffected."), /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Transport"), /* @__PURE__ */ React.createElement("label", { className: "inline" }, /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "radio",
            name: "cc-transport",
            checked: config.transport === "proxy",
            onChange: () => patch({ transport: "proxy" })
          }
        ), "Grafana server proxy ", /* @__PURE__ */ React.createElement("span", { className: "help" }, "(recommended \u2014 token stays on the server)")), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Requests go to ", /* @__PURE__ */ React.createElement("code", null, proxyBase, "/", config.proxyPath, "/"), ". nginx validates the Grafana session, adds the Zabbix API token and forwards to the Zabbix upstream configured on this Grafana server. The upstream is fixed in ", /* @__PURE__ */ React.createElement("code", null, "/etc/nginx/conf.d/zabbix.conf"), ", so use this transport when Zabbix is reachable from this server (typically localhost)."), /* @__PURE__ */ React.createElement("label", { className: "inline" }, /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "radio",
            name: "cc-transport",
            checked: config.transport === "direct",
            onChange: () => patch({ transport: "direct" })
          }
        ), "Direct API call from the browser ", /* @__PURE__ */ React.createElement("span", { className: "help" }, "(remote Zabbix)")), /* @__PURE__ */ React.createElement("p", { className: "help" }, "The browser calls the configured Zabbix address itself, so the same plugin install can run on any Grafana server and connect to a remote Zabbix. The Zabbix API must allow CORS from this Grafana origin.")), config.transport === "direct" ? /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Zabbix server"), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-api-url" }, "Zabbix address (IP, hostname or URL)"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-api-url",
            type: "text",
            value: config.apiUrl,
            placeholder: "zabbix.example.com",
            onChange: (e) => patch({ apiUrl: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Enter the Zabbix server IP or hostname; ", /* @__PURE__ */ React.createElement("code", null, "/api_jsonrpc.php"), " is appended automatically (HTTP is assumed when no scheme is given). A full endpoint such as", " ", /* @__PURE__ */ React.createElement("code", null, "https://zabbix.example/zabbix/api_jsonrpc.php"), " or a same-origin", " ", /* @__PURE__ */ React.createElement("code", null, "/api_jsonrpc.php"), " is also accepted. Effective endpoint:", " ", /* @__PURE__ */ React.createElement("code", null, endpoint)), insecureHttpEndpoint ? /* @__PURE__ */ React.createElement("div", { className: "warn" }, "This endpoint uses plain ", /* @__PURE__ */ React.createElement("code", null, "http://"), ", so the API token or login password travels across the network unencrypted and can be read by anyone who can observe the traffic. Use ", /* @__PURE__ */ React.createElement("code", null, "https://"), " (for example through a reverse proxy with a certificate) or the server proxy transport.") : null, /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-auth-method" }, "Authentication"), /* @__PURE__ */ React.createElement(
          "select",
          {
            id: "cc-auth-method",
            value: config.authMethod,
            onChange: (e) => patch({ authMethod: e.target.value === "credentials" ? "credentials" : "token" })
          },
          /* @__PURE__ */ React.createElement("option", { value: "token" }, "API token"),
          /* @__PURE__ */ React.createElement("option", { value: "credentials" }, "Username and password")
        ), config.authMethod === "credentials" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-username" }, "Zabbix username"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-username",
            type: "text",
            autoComplete: "username",
            value: config.username,
            placeholder: "grafana-cc",
            onChange: (e) => patch({ username: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-password" }, "Zabbix password"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-password",
            type: "password",
            autoComplete: "off",
            value: config.password,
            placeholder: "Zabbix password",
            onChange: (e) => patch({ password: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "The plugin calls ", /* @__PURE__ */ React.createElement("code", null, "user.login"), " with these credentials and keeps the returned session token in browser memory for 15 minutes; it logs in again automatically when the session expires. Use a dedicated read-only Zabbix user."), /* @__PURE__ */ React.createElement("div", { className: "warn" }, "The password is stored in the plugin settings (Grafana database, not encrypted) so that the browser can log in to Zabbix. Any signed-in user who can open this app can read it, including Viewers. Prefer an API token where possible, and only grant the read-only role.")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-token" }, "API token"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-token",
            type: "password",
            autoComplete: "off",
            value: config.token,
            placeholder: "Zabbix API token",
            onChange: (e) => patch({ token: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Create a dedicated Zabbix user with a read-only role and generate a token for it. Write methods are unnecessary."), /* @__PURE__ */ React.createElement("div", { className: "warn" }, "The token is stored in the plugin settings (Grafana database, not encrypted) so that the browser can use it. Any signed-in user who can open this app can read it, including Viewers. Only use a read-only token. Prefer the server proxy transport when the token must stay server-side."))) : /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Proxy locations"), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-proxy-path" }, "Authenticated proxy path"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-proxy-path",
            type: "text",
            value: config.proxyPath,
            onChange: (e) => patch({ proxyPath: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Relative to the Grafana sub-path. Effective endpoint:", " ", /* @__PURE__ */ React.createElement("code", null, proxyBase, "/", config.proxyPath, "/")), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-public-path" }, "Unauthenticated version path"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-public-path",
            type: "text",
            value: config.publicPath,
            onChange: (e) => patch({ publicPath: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Used for ", /* @__PURE__ */ React.createElement("code", null, "apiinfo.version"), ", which Zabbix rejects when an Authorization header is present. Still guarded by the Grafana session check.")), /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Branding"), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-brand-name" }, "Brand name"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-brand-name",
            type: "text",
            maxLength: 40,
            value: config.brandName,
            onChange: (e) => patch({ brandName: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Shown in the Command Center and Server Inventory header. Defaults to OPSBEACON."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-brand-tagline" }, "Tagline"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-brand-tagline",
            type: "text",
            maxLength: 80,
            value: config.brandTagline,
            onChange: (e) => patch({ brandTagline: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Displayed after the brand name in the header eyebrow."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-logo-file" }, "Logo"), /* @__PURE__ */ React.createElement("div", { className: "cc-cfg-logo" }, /* @__PURE__ */ React.createElement("div", { className: "cc-cfg-logo-preview" }, config.logoUrl ? /* @__PURE__ */ React.createElement("img", { src: config.logoUrl, alt: "Brand logo preview" }) : /* @__PURE__ */ React.createElement("span", null, "No logo")), /* @__PURE__ */ React.createElement("div", { className: "cc-cfg-logo-actions" }, /* @__PURE__ */ React.createElement("label", { className: "cc-cfg-file", htmlFor: "cc-logo-file" }, "Upload logo\u2026", /* @__PURE__ */ React.createElement("input", { id: "cc-logo-file", type: "file", accept: LOGO_TYPES, onChange: onLogoFile })), config.logoUrl ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "secondary", onClick: () => patch({ logoUrl: "" }) }, "Remove logo") : null)), /* @__PURE__ */ React.createElement("p", { className: "help" }, "PNG, SVG, JPEG, WebP or GIF up to 256 KB. The image replaces the default three-bar mark and is contained within a 40 px-high header slot."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-logo-url" }, "Or logo URL"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-logo-url",
            type: "text",
            placeholder: "https://example.com/logo.svg",
            value: config.logoUrl.startsWith("data:") ? "" : config.logoUrl,
            onChange: (e) => patch({ logoUrl: e.target.value })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, config.logoUrl.startsWith("data:") ? "Currently using an uploaded image embedded in plugin settings. Enter a URL to replace it." : "An absolute http(s) URL to an image. Leave blank to use the default mark."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-motion" }, "Animations"), /* @__PURE__ */ React.createElement(
          "select",
          {
            id: "cc-motion",
            value: config.motion,
            onChange: (e) => patch({ motion: e.target.value })
          },
          /* @__PURE__ */ React.createElement("option", { value: "system" }, "Follow the system setting (recommended)"),
          /* @__PURE__ */ React.createElement("option", { value: "full" }, "Always animate"),
          /* @__PURE__ */ React.createElement("option", { value: "reduced" }, "Always reduce motion")
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Controls the aurora drift, LIVE PROBLEMS marquee, title shimmer, gauge and history animations. The system setting disables them when the browser reports", " ", /* @__PURE__ */ React.createElement("code", null, "prefers-reduced-motion"), ", which is common on Windows RDP sessions and desktops with animation effects turned off. Choose ", /* @__PURE__ */ React.createElement("strong", null, "Always animate"), " ", "for a wall display that must keep moving.")), /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Dashboard behaviour"), /* @__PURE__ */ React.createElement("label", { className: "inline", htmlFor: "cc-sample-data" }, /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-sample-data",
            type: "checkbox",
            checked: config.sampleDataEnabled,
            onChange: (e) => patch(
              e.target.checked ? { sampleDataEnabled: true } : { sampleDataEnabled: false, defaultSource: "live" }
            )
          }
        ), "Enable sample dataset"), /* @__PURE__ */ React.createElement("p", { className: "help" }, "When enabled, users can switch between SAMPLE and LIVE in the dashboard header. When disabled, Grafana-hosted dashboards are live-only: the SAMPLE button is hidden, sample drill-down links fall back to live data, and the page always opens in live mode. The standalone preview has no Grafana settings and keeps sample data."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-refresh" }, "Live refresh interval (seconds)"), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "cc-refresh",
            type: "number",
            min: 15,
            max: 3600,
            step: 5,
            value: config.refreshSeconds,
            onChange: (e) => patch({ refreshSeconds: parseInt(e.target.value, 10) || DEFAULT_ZABBIX_CONFIG.refreshSeconds })
          }
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Between 15 s and 1 hour. The header shows the last successful sync time."), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-default-source" }, "Data mode when the page opens"), /* @__PURE__ */ React.createElement(
          "select",
          {
            id: "cc-default-source",
            value: config.sampleDataEnabled ? config.defaultSource : "live",
            disabled: !config.sampleDataEnabled,
            onChange: (e) => patch({ defaultSource: e.target.value === "live" ? "live" : "sample" })
          },
          /* @__PURE__ */ React.createElement("option", { value: "sample" }, "Sample dataset"),
          /* @__PURE__ */ React.createElement("option", { value: "live" }, "Live Zabbix data")
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, config.sampleDataEnabled ? "Users can still switch between SAMPLE and LIVE in the dashboard header." : "Sample data is disabled, so the page always opens in live mode.")), /* @__PURE__ */ React.createElement("div", { className: "cc-cfg-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onSave, disabled: saving || testing }, saving ? "Saving\u2026" : "Save connection"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "secondary", onClick: onTest, disabled: saving || testing }, testing ? "Testing\u2026" : "Test connection")), /* @__PURE__ */ React.createElement("div", { className: "endpoint" }, "Effective API endpoint: ", /* @__PURE__ */ React.createElement("code", null, endpoint)), status ? /* @__PURE__ */ React.createElement("div", { className: `status ${status.tone}` }, status.text) : null);
      }

      function AppRoot(props) {
        const rawPath = props && props.path || (typeof window !== "undefined" ? window.location.pathname : "");
        const path = String(rawPath).split("?")[0].split("#")[0];
        const initialConfig = normalizeConfig(props?.meta?.jsonData || void 0);
        let page;
        if (/\/servers\/?$/.test(path)) {
          page = /* @__PURE__ */ React.createElement(ServerListPage, { query: props && props.query, initialConfig });
        } else if (/\/data-center\/?$/.test(path)) {
          page = /* @__PURE__ */ React.createElement(DataCenterPage, { initialConfig });
        } else {
          page = /* @__PURE__ */ React.createElement(CommandCenterPage, { initialConfig });
        }
        return /* @__PURE__ */ React.createElement(ErrorBoundary, { key: path }, page);
      }
      const plugin = exports("plugin", new AppPlugin().setRootPage(AppRoot).addConfigPage({
        id: "zabbix",
        title: "Zabbix connection",
        icon: "database",
        body: ZabbixConfigPage
      }));

    })
  };
}));
//# sourceMappingURL=module.js.map
