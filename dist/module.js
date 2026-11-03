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
        gray: { tone: "#8ea3bf", bg: "rgba(142, 163, 191, 0.10)" }
      };
      const GROUP_COLOR = {
        PROD: "#ff3d57",
        DR: "#2f9bff",
        UAT: "#8b5cf6"
      };
      const fmt$1 = (n) => n.toLocaleString("en-US");
      const pct$1 = (n) => `${n.toFixed(1)}%`;
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
      function Header({
        filters,
        onChange,
        options,
        now,
        source,
        onSource,
        connection,
        version,
        hostCount,
        lastSync,
        canGoLive,
        sampleEnabled = true
      }) {
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
        return /* @__PURE__ */ React.createElement("div", { className: "cc-header" }, /* @__PURE__ */ React.createElement("div", { className: "cc-brand" }, /* @__PURE__ */ React.createElement("div", { className: "cc-logo" }, /* @__PURE__ */ React.createElement("span", { style: { background: "#28a9ff" } }), /* @__PURE__ */ React.createElement("span", { style: { background: "#00d47e" } }), /* @__PURE__ */ React.createElement("span", { style: { background: "#ffb020" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-title" }, "INFRASTRUCTURE OPERATIONS COMMAND CENTER"), /* @__PURE__ */ React.createElement("div", { className: "cc-subtitle" }, "All Servers\xA0\xA0|\xA0\xA0500 - 1,500 Servers\xA0\xA0|\xA0\xA0Real-time Infrastructure Health from Zabbix"))), /* @__PURE__ */ React.createElement("div", { className: "cc-filters" }, /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Environment"), /* @__PURE__ */ React.createElement("select", { value: filters.environment, onChange: (e) => onChange("environment", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.environments.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "System Tier"), /* @__PURE__ */ React.createElement("select", { value: filters.tier, onChange: (e) => onChange("tier", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.tiers.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Host Group"), /* @__PURE__ */ React.createElement("select", { value: filters.hostGroup, onChange: (e) => onChange("hostGroup", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.groups.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "OS Type"), /* @__PURE__ */ React.createElement("select", { value: filters.os, onChange: (e) => onChange("os", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.os.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ React.createElement("div", { className: "cc-filter" }, /* @__PURE__ */ React.createElement("label", null, "Business Service"), /* @__PURE__ */ React.createElement("select", { value: filters.businessService, onChange: (e) => onChange("businessService", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All"), options.services.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o))))), /* @__PURE__ */ React.createElement("div", { className: "cc-header-right" }, canGoLive ? sampleEnabled ? /* @__PURE__ */ React.createElement("div", { className: "cc-mode" }, /* @__PURE__ */ React.createElement(
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
        )) : /* @__PURE__ */ React.createElement("div", { className: "cc-mode", title: "Sample data is disabled in the plugin configuration" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mode-note" }, "LIVE ONLY")) : null, /* @__PURE__ */ React.createElement("div", { className: "cc-clock" }, /* @__PURE__ */ React.createElement("div", { className: "cc-clock-date" }, date), /* @__PURE__ */ React.createElement("div", { className: "cc-clock-time" }, time), /* @__PURE__ */ React.createElement("div", { className: "cc-clock-zone" }, "(GMT+8)")), /* @__PURE__ */ React.createElement("div", { className: `cc-zabbix is-${connection}` }, /* @__PURE__ */ React.createElement("span", { className: "cc-zabbix-dot" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-zabbix-label" }, "ZABBIX"), /* @__PURE__ */ React.createElement("div", { className: "cc-zabbix-sub" }, connection === "sample" ? "Sample dataset \xB7 no API calls" : connection === "loading" ? "Connecting to Zabbix API\u2026" : connection === "ready" ? `v${version || "?"} \xB7 ${fmt$1(hostCount || 0)} hosts \xB7 sync ${lastSync || "\u2014"}` : "Connection failed")), /* @__PURE__ */ React.createElement(
          "span",
          {
            className: `cc-sample-badge ${connection === "ready" ? "is-live" : ""} ${connection === "error" ? "is-error" : ""}`
          },
          connection === "sample" ? "SAMPLE" : connection === "loading" ? "SYNC" : connection === "ready" ? "LIVE" : "ERROR"
        ))));
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
        if (href) {
          return /* @__PURE__ */ React.createElement(
            "a",
            {
              className: "cc-kpi cc-kpi-link",
              style,
              href,
              title: `Open the server list for ${label.toLowerCase()}`
            },
            body
          );
        }
        return /* @__PURE__ */ React.createElement("div", { className: "cc-kpi", style }, body);
      }
      function Donut({
        segments,
        size = 88,
        centerValue,
        centerLabel
      }) {
        const r = 38;
        const circumference = 2 * Math.PI * r;
        const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
        let offset = 0;
        return /* @__PURE__ */ React.createElement("div", { className: "cc-donut", style: { width: size, height: size } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 100" }, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "#12233c", strokeWidth: "10" }), segments.map((s, i) => {
          const length = s.value / total * circumference;
          const dash = Math.max(0, length - 1.2);
          const circle = /* @__PURE__ */ React.createElement(
            "circle",
            {
              key: i,
              cx: "50",
              cy: "50",
              r,
              fill: "none",
              stroke: s.color,
              strokeWidth: "10",
              strokeDasharray: `${dash} ${circumference - dash}`,
              strokeDashoffset: -offset,
              transform: "rotate(-90 50 50)"
            }
          );
          offset += length;
          return circle;
        })), /* @__PURE__ */ React.createElement("div", { className: "cc-donut-center" }, /* @__PURE__ */ React.createElement("div", { className: "cc-donut-value" }, centerValue), /* @__PURE__ */ React.createElement("div", { className: "cc-donut-unit" }, centerLabel)));
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
        const bars = Array.from({ length: 36 }, (_, i) => {
          const wave = Math.abs(Math.sin(i * 0.63 + avg * 0.12));
          return 16 + wave * 66 + i * 7 % 11;
        });
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, sub)), /* @__PURE__ */ React.createElement("div", { className: "cc-util-body" }, /* @__PURE__ */ React.createElement(
          Donut,
          {
            segments: [
              { value: critical, color: "#ff3d57" },
              { value: warning, color: "#ffc107" },
              { value: normal, color: "#00d47e" }
            ],
            size: 88,
            centerValue: `${Math.round(avg)}%`,
            centerLabel: "Avg"
          }
        ), /* @__PURE__ */ React.createElement("div", { className: "cc-bars" }, bars.map((h, i) => /* @__PURE__ */ React.createElement(
          "span",
          {
            key: i,
            className: "cc-bar",
            style: {
              height: `${Math.min(100, h)}%`,
              background: `linear-gradient(180deg, ${i % 3 === 0 ? accent : "#2f6fff"}, rgba(20, 60, 130, 0.35))`
            }
          }
        ))), /* @__PURE__ */ React.createElement("div", { className: "cc-legend" }, /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ff3d57" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Critical (\u2265 90%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(critical))), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ffc107" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Warning (70\u201390%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(warning))), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#00d47e" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Normal (< 70%)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(normal))))));
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
      function GroupGrids({
        groups,
        onSelect
      }) {
        return /* @__PURE__ */ React.createElement("div", { className: "cc-groups" }, groups.map((g) => {
          const c = groupCounts(g.tiers.flatMap((t) => t.hosts));
          return /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-group", key: g.key, style: { "--group": GROUP_COLOR[g.key] } }, /* @__PURE__ */ React.createElement("div", { className: "cc-group-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-group-name" }, g.name), /* @__PURE__ */ React.createElement("div", { className: "cc-group-total" }, "(", fmt$1(g.total), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-group-chips" }, /* @__PURE__ */ React.createElement("span", { className: "cc-chip cc-chip-green" }, "\u25CF ", c.healthy), /* @__PURE__ */ React.createElement("span", { className: "cc-chip cc-chip-yellow" }, "\u25CF ", c.warning), /* @__PURE__ */ React.createElement("span", { className: "cc-chip cc-chip-red" }, "\u25CF ", c.critical), /* @__PURE__ */ React.createElement("span", { className: "cc-chip cc-chip-gray" }, "\u25CF ", c.stale))), /* @__PURE__ */ React.createElement("div", { className: "cc-grid-wrap" }, g.tiers.map((tier) => {
            const tc = groupCounts(tier.hosts);
            return /* @__PURE__ */ React.createElement("div", { className: "cc-tier-row", key: tier.name }, /* @__PURE__ */ React.createElement("div", { className: "cc-tier-label" }, /* @__PURE__ */ React.createElement("div", { className: "cc-tier-title" }, tier.name), /* @__PURE__ */ React.createElement("div", { className: "cc-tier-sub" }, tier.subtitle, " (", fmt$1(tier.hosts.length), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-tier-counts" }, /* @__PURE__ */ React.createElement("span", { style: { color: "#00e676" } }, tc.healthy), /* @__PURE__ */ React.createElement("span", { style: { color: "#ffc107" } }, tc.warning), /* @__PURE__ */ React.createElement("span", { style: { color: "#ff3d57" } }, tc.critical), /* @__PURE__ */ React.createElement("span", { style: { color: "#8ea3bf" } }, tc.stale))), /* @__PURE__ */ React.createElement("div", { className: "cc-host-grid" }, tier.hosts.map((h) => /* @__PURE__ */ React.createElement(
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
          })), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-inline" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#00d47e" } }), " Healthy"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#ffc107" } }), " Warning"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#ff3d57" } }), " Critical"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#67768a" } }), " Stale"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#3b82f6" } }), " Maintenance"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "cc-dot", style: { background: "#9f1239" } }), " Unavailable")));
        }));
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
          ) : r.name), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.env), /* @__PURE__ */ React.createElement("td", { className: "num" }, fmt$1(r.servers)), /* @__PURE__ */ React.createElement("td", { className: `cc-status cc-status-${r.status.toLowerCase()}` }, r.status), /* @__PURE__ */ React.createElement("td", { className: "num", style: { color: r.activeProblems > 0 ? "#ff8a3d" : "#00d47e" } }, r.activeProblems));
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
      function FreshnessPanel({
        counts,
        total
      }) {
        const safeTotal = total || 1;
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-freshness" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "Monitoring Data Freshness")), /* @__PURE__ */ React.createElement("div", { className: "cc-freshness-body" }, /* @__PURE__ */ React.createElement(
          Donut,
          {
            segments: [
              { value: counts.upToDate, color: "#00d47e" },
              { value: counts.stale, color: "#ffc107" },
              { value: counts.noData, color: "#ff3d57" },
              { value: counts.notMonitored, color: "#5f7591" }
            ],
            size: 108,
            centerValue: fmt$1(total),
            centerLabel: "Total Hosts"
          }
        ), /* @__PURE__ */ React.createElement("div", { className: "cc-freshness-legend" }, /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#00d47e" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Up to date"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(counts.upToDate), " (", pct$1(counts.upToDate / safeTotal * 100), ")")), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ffc107" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Stale (5\u201310m)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(counts.stale), " (", pct$1(counts.stale / safeTotal * 100), ")")), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#ff3d57" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "No data (>10m)"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(counts.noData), " (", pct$1(counts.noData / safeTotal * 100), ")")), /* @__PURE__ */ React.createElement("div", { className: "cc-legend-row" }, /* @__PURE__ */ React.createElement("span", { className: "cc-dot", style: { background: "#5f7591" } }), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-label" }, "Not monitored"), /* @__PURE__ */ React.createElement("span", { className: "cc-legend-value" }, fmt$1(counts.notMonitored), " (", pct$1(counts.notMonitored / safeTotal * 100), ")")))));
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
        onResource
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
        ))), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Env"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", { className: "num" }, RESOURCE_LABEL[resource]), /* @__PURE__ */ React.createElement("th", null, "Trend (24h)"))), /* @__PURE__ */ React.createElement("tbody", null, rows.slice(0, 10).map((r, i) => /* @__PURE__ */ React.createElement("tr", { key: r.hostname }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, r.hostname), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.environment), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, r.tier.replace("Tier ", "T")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "cc-bar-cell" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mini-track" }, /* @__PURE__ */ React.createElement("span", { className: "cc-mini-fill", style: { width: `${value(r)}%`, background: RESOURCE_COLOR[resource] } })), /* @__PURE__ */ React.createElement("span", { style: { color: RESOURCE_COLOR[resource], fontWeight: 700 } }, value(r), "%"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Sparkline$1, { values: r.trends[resource], color: RESOURCE_COLOR[resource] })))), rows.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "cc-muted" }, "No hosts match the current filters.")) : null))));
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
        refreshSeconds
      }) {
        const refreshLabel = refreshSeconds && refreshSeconds >= 60 && refreshSeconds % 60 === 0 ? `${refreshSeconds / 60}m` : `${refreshSeconds || 60}s`;
        const visible = problems.filter((p) => tab === "All" || p.severityGroup === tab);
        const shown = visible.slice(0, 10);
        return /* @__PURE__ */ React.createElement("div", { className: "cc-panel cc-problems" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, "Active Zabbix Problems (", fmt$1(problems.length), ")"), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, source === "live" ? "Live Zabbix API \xB7 read-only" : "Sample data mode \xB7 read-only")), /* @__PURE__ */ React.createElement("div", { className: "cc-problem-tabs" }, ["All", "Critical", "Warning", "Info"].map((t) => /* @__PURE__ */ React.createElement("button", { key: t, type: "button", className: `cc-tab ${tab === t ? "active" : ""}`, onClick: () => onTab(t) }, t, " (", fmt$1(counts[t] ?? 0), ")")), /* @__PURE__ */ React.createElement("span", { className: "cc-spacer" }), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { fontSize: 8 } }, "Showing ", shown.length, " of ", visible.length)), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-problem-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Time"), /* @__PURE__ */ React.createElement("th", null, "Severity"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Environment"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", null, "Business Service"), /* @__PURE__ */ React.createElement("th", null, "Problem"), /* @__PURE__ */ React.createElement("th", null, "Current Value"), /* @__PURE__ */ React.createElement("th", null, "Threshold"), /* @__PURE__ */ React.createElement("th", null, "Duration"), /* @__PURE__ */ React.createElement("th", null, "SLA Status"), /* @__PURE__ */ React.createElement("th", null, "Ack"), /* @__PURE__ */ React.createElement("th", null, "Maintenance"), /* @__PURE__ */ React.createElement("th", null, "Related / Impact"))), /* @__PURE__ */ React.createElement("tbody", null, shown.map((p, i) => /* @__PURE__ */ React.createElement("tr", { key: p.id }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.time), /* @__PURE__ */ React.createElement("td", { className: severityClass(p.severity) }, p.severity), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, p.hostname), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.environment), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.tier.replace("Tier ", "T")), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.businessService), /* @__PURE__ */ React.createElement("td", null, p.problem), /* @__PURE__ */ React.createElement("td", { className: "cc-strong" }, p.currentValue), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, p.threshold), /* @__PURE__ */ React.createElement("td", { className: "cc-duration" }, p.duration), /* @__PURE__ */ React.createElement("td", { className: slaClass(p.sla) }, p.sla), /* @__PURE__ */ React.createElement("td", { className: p.ack ? "cc-ack-yes" : "cc-ack-no" }, p.ack ? "Yes" : "No"), /* @__PURE__ */ React.createElement("td", { className: p.maintenance ? "cc-ack-yes" : "cc-muted" }, p.maintenance ? "Yes" : "No"), /* @__PURE__ */ React.createElement("td", { className: "cc-related" }, "\u21B3 ", p.related))), shown.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 15, className: "cc-muted" }, "No problems in this view.")) : null))), /* @__PURE__ */ React.createElement("div", { className: "cc-footer" }, /* @__PURE__ */ React.createElement("span", null, source === "live" ? `Data source: Zabbix API \xB7 read-only \xB7 refresh: ${refreshLabel}` : "Data source: deterministic sample dataset (1,268 hosts, 76 problems) \xB7 no Zabbix calls"), /* @__PURE__ */ React.createElement("span", null, "Time zone: GMT+8")));
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
        defaultSource: "sample"
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
          defaultSource: r.defaultSource === "live" ? "live" : "sample"
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
          defaultSource: config.sampleDataEnabled ? config.defaultSource : "live"
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
        const res = await fetch(settingsUrl(), {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ enabled: true, pinned: true, jsonData: toJsonData(config) })
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
        cache = { config: { ...config }, at: Date.now() };
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

      const MAX_POINTS = 24;
      const HISTORY_SECONDS = 24 * 60 * 60;
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
      function sampleFilesystems(host) {
        const mounts = host.os === "Windows" ? ["C:", "D:", "E:"] : ["/", "/data", "/var", "/opt"];
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
        const match = key.match(/\[(.*),pused\]/);
        const mount = match ? match[1].replace(/^"|"$/g, "") : "";
        return mount || "/";
      }
      async function historyFor(rpc, item, convert) {
        try {
          const rows = await rpc("history.get", {
            output: "extend",
            history: parseInt(item.value_type || "0", 10) || 0,
            itemids: [item.itemid],
            time_from: Math.floor(Date.now() / 1e3) - HISTORY_SECONDS,
            sortfield: "clock",
            sortorder: "ASC",
            limit: 2e3
          });
          const values = rows.map((row) => numeric$1(row.value)).filter((value) => value !== null).map((value) => convert ? convert(value) : value);
          return downsample$1(values).map(round);
        } catch {
          return [];
        }
      }
      function makeRpc(config) {
        return (method, params) => zabbixRpc(config, method, params);
      }
      async function fetchHostDetail(host) {
        const config = await loadZabbixConfig();
        const rpc = makeRpc(config);
        const hosts = await rpc("host.get", {
          output: ["hostid"],
          filter: { host: [host.hostname] }
        });
        const hostid = hosts[0] && hosts[0].hostid;
        if (!hostid) {
          return fallbackHostDetail(host, "This host is no longer present in Zabbix.");
        }
        const items = await rpc("item.get", {
          output: ["itemid", "key_", "lastvalue", "value_type"],
          hostids: [hostid],
          monitored: true,
          limit: 5e3
        });
        const byKey = new Map(items.map((item) => [item.key_, item]));
        const cpuItem = byKey.get("system.cpu.util");
        const memItem = byKey.get("vm.memory.util") || byKey.get("vm.memory.utilization");
        const pavailable = !memItem ? byKey.get("vm.memory.size[pavailable]") : void 0;
        const filesystemByMount = /* @__PURE__ */ new Map();
        let diskItem;
        let diskUsed = -1;
        for (const item of items) {
          if (!/^vfs\.fs\.(dependent\.)?size\[[^\]]*pused\]$/.test(item.key_)) {
            continue;
          }
          const used = numeric$1(item.lastvalue);
          if (used === null) {
            continue;
          }
          const mount = parseMount(item.key_);
          const previous = filesystemByMount.get(mount);
          if (!previous || used > previous.used) {
            filesystemByMount.set(mount, { mount, used: round(used) });
          }
          if (used > diskUsed) {
            diskUsed = used;
            diskItem = item;
          }
        }
        const filesystems = Array.from(filesystemByMount.values()).sort((a, b) => b.used - a.used);
        if (!filesystems.length) {
          filesystems.push({ mount: host.os === "Windows" ? "C:" : "/", used: host.disk });
        }
        const [cpu, memory, disk] = await Promise.all([
          cpuItem ? historyFor(rpc, cpuItem) : Promise.resolve([]),
          memItem ? historyFor(rpc, memItem) : pavailable ? historyFor(rpc, pavailable, (value) => 100 - value) : Promise.resolve([]),
          diskItem ? historyFor(rpc, diskItem) : Promise.resolve([])
        ]);
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

      const HEALTH_COLOR = {
        healthy: "#00d47e",
        warning: "#ffc107",
        critical: "#ff4d67",
        stale: "#8ea3bf",
        maintenance: "#5fb0ff",
        unavailable: "#ff8a3d"
      };
      const BAND_COLOR = (value) => value >= 90 ? "#ff4d67" : value >= 70 ? "#ffc107" : "#00d47e";
      const BAND_LABEL = (value) => value >= 90 ? "Critical" : value >= 70 ? "Warning" : "Normal";
      const METRICS = [
        { key: "cpu", label: "CPU Utilisation", accent: "#2f9bff" },
        { key: "memory", label: "Memory Utilisation", accent: "#8b5cf6" },
        { key: "disk", label: "Disk Utilisation", accent: "#00d47e" },
        { key: "network", label: "Network Utilisation", accent: "#00d4ff" }
      ];
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
        const w = 160;
        const h = 40;
        const pad = 3;
        const n = values.length;
        const point = (value, index) => [
          pad + index * (w - pad * 2) / (n - 1),
          h - pad - Math.max(0, Math.min(100, value)) / 100 * (h - pad * 2)
        ];
        const points = values.map(point);
        const line = points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
        const area = `M ${points[0][0]},${h - pad} L ${line.replace(/ /g, " L ")} L ${points[n - 1][0]},${h - pad} Z`;
        const last = points[n - 1];
        return /* @__PURE__ */ React.createElement("svg", { className: "cc-detail-spark", viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: pad,
            y1: h - pad - 0.9 * (h - pad * 2),
            x2: w - pad,
            y2: h - pad - 0.9 * (h - pad * 2),
            stroke: "#ff4d67",
            strokeWidth: "1",
            strokeDasharray: "2 3",
            opacity: "0.35"
          }
        ), /* @__PURE__ */ React.createElement("path", { d: area, fill: color, opacity: "0.12" }), /* @__PURE__ */ React.createElement("polyline", { points: line, fill: "none", stroke: color, strokeWidth: "1.5", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: last[0], cy: last[1], r: "2.2", fill: color }));
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
          const onKey = (event) => {
            if (event.key === "Escape") {
              onClose();
            }
          };
          window.addEventListener("keydown", onKey);
          return () => window.removeEventListener("keydown", onKey);
        }, [onClose]);
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
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cc-modal-kicker" }, "SERVER STATISTICS", /* @__PURE__ */ React.createElement("span", { className: `cc-modal-source ${source}` }, source.toUpperCase())), /* @__PURE__ */ React.createElement("div", { className: "cc-modal-title", id: "cc-host-detail-title" }, host.hostname), /* @__PURE__ */ React.createElement("div", { className: "cc-modal-sub" }, host.environment, " \xB7 ", host.tier, " \xB7 ", host.hostGroup, " \xB7 ", host.os, " \xB7 ", host.businessService)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-modal-close", onClick: onClose, "aria-label": "Close server statistics" }, "\xD7")),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-body" }, /* @__PURE__ */ React.createElement("div", { className: "cc-metric-grid" }, METRICS.map((metric) => {
              const value = host[metric.key];
              const trend = detail ? detail.trends[metric.key] : void 0;
              return /* @__PURE__ */ React.createElement("div", { className: "cc-metric-card", key: metric.key }, /* @__PURE__ */ React.createElement(Gauge, { value, color: BAND_COLOR(value) }), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-info" }, /* @__PURE__ */ React.createElement("div", { className: "cc-metric-name" }, metric.label), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-band", style: { color: BAND_COLOR(value) } }, BAND_LABEL(value)), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-fleet" }, "Fleet avg ", fleet[metric.key].toFixed(1), "%")), /* @__PURE__ */ React.createElement(Sparkline, { values: trend, color: metric.accent }), /* @__PURE__ */ React.createElement("div", { className: "cc-metric-foot" }, trend && trend.length > 1 ? "last 24 h" : "current snapshot"));
            })), /* @__PURE__ */ React.createElement("div", { className: "cc-detail-grid" }, /* @__PURE__ */ React.createElement(
              Section,
              {
                title: "Filesystem usage",
                sub: filesystems.length ? `${filesystems.length} filesystem${filesystems.length === 1 ? "" : "s"}` : void 0
              },
              !detail ? /* @__PURE__ */ React.createElement("div", { className: "cc-detail-empty" }, "Loading filesystem data from Zabbix\u2026") : /* @__PURE__ */ React.createElement("div", { className: "cc-fs-list" }, filesystems.map((fs) => /* @__PURE__ */ React.createElement("div", { className: "cc-fs-row", key: fs.mount }, /* @__PURE__ */ React.createElement("span", { className: "cc-fs-mount", title: fs.mount }, fs.mount), /* @__PURE__ */ React.createElement(UsageTrack, { value: fs.used, color: BAND_COLOR(fs.used) }), /* @__PURE__ */ React.createElement("span", { className: "cc-fs-value", style: { color: BAND_COLOR(fs.used) } }, fs.used.toFixed(0), "%"))), /* @__PURE__ */ React.createElement("div", { className: "cc-fs-legend" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#00d47e" } }), " < 70%"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#ffc107" } }), " 70\u201390%"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { style: { background: "#ff4d67" } }), " \u2265 90%")))
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
            )),
            /* @__PURE__ */ React.createElement("div", { className: "cc-modal-foot" }, /* @__PURE__ */ React.createElement(
              "span",
              {
                className: `cc-detail-note ${state === "error" ? "error" : detail && detail.partial ? "partial" : ""}`
              },
              detail ? detail.note : state === "loading" ? "Loading live details from Zabbix\u2026" : ""
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
        ["Linux", 70],
        ["Windows", 18],
        ["AIX", 6],
        ["Solaris", 6]
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
          memory: { critical: 24, warning: 84 },
          disk: { critical: 32, warning: 100 },
          network: { critical: 10, warning: 40 }
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
          memory: { critical: 16, warning: 52 },
          disk: { critical: 20, warning: 60 },
          network: { critical: 7, warning: 26 }
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
          memory: { critical: 12, warning: 40 },
          disk: { critical: 16, warning: 50 },
          network: { critical: 5, warning: 20 }
        }
      ];
      function pad$1(n) {
        return n < 10 ? `0${n}` : String(n);
      }
      function formatTime(minutesAgo) {
        const d = new Date(Date.now() - minutesAgo * 6e4);
        return `${d.getFullYear()}-${pad$1(d.getMonth() + 1)}-${pad$1(d.getDate())} ${pad$1(d.getHours())}:${pad$1(d.getMinutes())}`;
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
      function makeTopServers() {
        const rows = [
          ["core-bank-01", "PROD", "Tier 1", 98, 92, 81, "Core Banking"],
          ["pay-batch-02", "PROD", "Tier 1", 96, 88, 76, "Payment Gateway"],
          ["app-core-03", "PROD", "Tier 2", 94, 85, 89, "Other Services"],
          ["db-uat-01", "UAT", "Tier 2", 91, 93, 72, "Other Services"],
          ["web-portal-01", "PROD", "Tier 2", 88, 78, 84, "Internet Banking"],
          ["rhdl-app-15", "PROD", "Tier 3", 86, 72, 68, "Other Services"],
          ["app-dev-06", "UAT", "Tier 3", 84, 69, 74, "Other Services"],
          ["integ-srv-02", "PROD", "Tier 3", 82, 77, 66, "Core Banking"],
          ["rhel-dr-07", "DR", "Tier 3", 79, 71, 62, "Other Services"],
          ["app-uat-09", "UAT", "Tier 3", 79, 68, 65, "Other Services"]
        ];
        return rows.map(([hostname, environment, tier, cpu, memory, disk, businessService], i) => ({
          rank: i + 1,
          hostname,
          environment,
          tier,
          os: "Linux",
          businessService,
          cpu,
          memory,
          disk,
          trends: {
            cpu: trend(cpu, 100 + i),
            memory: trend(memory, 200 + i),
            disk: trend(disk, 300 + i)
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
              const hostname = `${prefix}${slug}-${pad$1(nameCounters[slug])}`;
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
            warning: [72, 89],
            normal: [15, 65]
          });
          assignMetric(envHosts, "disk", spec.disk, {
            critical: [90, 99],
            warning: [75, 89],
            normal: [15, 69]
          });
          assignMetric(envHosts, "network", spec.network, {
            critical: [90, 99],
            warning: [70, 85],
            normal: [5, 42]
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
          const highest = Math.max(h.cpu, h.memory, h.disk);
          let problem = template.text;
          let current = `${highest}%`;
          let threshold = template.threshold;
          if (highest === h.cpu) {
            problem = "CPU utilization is too high";
            current = `${h.cpu}%`;
            threshold = "> 90%";
          } else if (highest === h.memory) {
            problem = "Memory utilization is too high";
            current = `${h.memory}%`;
            threshold = "> 90%";
          } else {
            problem = "Filesystem /var is full";
            current = `${h.disk}%`;
            threshold = "> 90%";
          }
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
          topServers: makeTopServers(),
          utilization: {
            cpu: { avg: 36, critical: 38, warning: 124, normal: 1106 },
            memory: { avg: 48, critical: 52, warning: 176, normal: 1040 },
            disk: { avg: 52, critical: 68, warning: 210, normal: 2481 },
            network: { avg: 28, critical: 22, warning: 86, normal: 2345 }
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
      function pad(n) {
        return n < 10 ? `0${n}` : String(n);
      }
      function timeLabel(clockSec) {
        const d = new Date(clockSec * 1e3);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
      function osFromInventory(host) {
        const text = `${host.inventory?.os || ""} ${host.inventory?.os_full || ""}`;
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
      function numeric(value) {
        if (value === void 0 || value === null || value === "") {
          return null;
        }
        const n = parseFloat(value);
        return Number.isFinite(n) ? n : null;
      }
      function metricForHost(items) {
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
          } else if (key === "vm.memory.util" || key === "vm.memory.utilization") {
            memory = value;
            memItem = item.itemid;
          } else if (key === "vm.memory.size[pavailable]" && memory === null) {
            memory = Math.max(0, 100 - value);
            memItem = item.itemid;
          } else if (/^vfs\.fs\.(dependent\.)?size\[[^\]]*pused\]$/.test(key)) {
            if (disk === null || value > disk) {
              disk = value;
              diskItem = item.itemid;
            }
          } else if (/^net\.if\.in\[[^\]]*\]$/.test(key) && !/errors|dropped|collisions/i.test(key)) {
            netIn += value;
            sawNet = true;
          } else if (/^net\.if\.out\[[^\]]*\]$/.test(key) && !/errors|dropped|collisions/i.test(key)) {
            netOut += value;
            sawNet = true;
          }
        }
        const lastSeenMin = lastClock > 0 ? Math.max(0, Math.round((Date.now() / 1e3 - lastClock) / 60)) : 9999;
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
        const hosts = hostsRaw.map((zh, index) => {
          const groups = (zh.groups || []).map((g) => g.name);
          const metrics = metricForHost(itemsByHost.get(zh.hostid) || []);
          const maintenance = zh.maintenance_status === "1" || maintenanceHostIds.has(zh.hostid);
          const unavailable = zh.available === "2" || (zh.interfaces || []).some((i) => i.available === "2");
          const severityNum = maxSeverityByHost.get(zh.hostid) || 0;
          const critical = severityNum >= 4;
          const warning = severityNum >= 2 && !critical;
          let dataState = "upToDate";
          if (!metrics.hasItems) {
            dataState = "notMonitored";
          } else if (metrics.lastSeenMin > 10) {
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
            os: osFromInventory(zh),
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
        const now = Date.now() / 1e3;
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
          metricItemByHost.set(zh.host, metricForHost(itemsByHost.get(zh.hostid) || []).itemIds);
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
          fetchedAt: /* @__PURE__ */ new Date(),
          transport: config.transport
        };
      }

      const CSS = `
.cc-app {
  min-height: 100vh;
  margin: 0;
  padding: 14px 16px 26px;
  background:
    radial-gradient(1200px 500px at 15% -10%, rgba(20, 70, 140, 0.20), transparent 60%),
    radial-gradient(900px 400px at 85% -5%, rgba(0, 120, 90, 0.10), transparent 60%),
    #050a13;
  color: #dbe7f5;
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
}
.cc-app * { box-sizing: border-box; }
.cc-app select { font-family: inherit; }

.cc-header { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 13px; }
.cc-brand { display: flex; gap: 12px; align-items: center; min-width: 330px; }
.cc-logo { display: flex; gap: 3px; align-items: stretch; height: 38px; }
.cc-logo span { display: block; width: 9px; border-radius: 2px; }
.cc-title { font-size: 26px; font-weight: 800; letter-spacing: 0.4px; line-height: 0.95; white-space: nowrap; }
.cc-subtitle { font-size: 10.5px; color: #8ea3bf; margin-top: 6px; letter-spacing: 0.2px; white-space: nowrap; }
.cc-filters { display: flex; gap: 9px; flex-wrap: wrap; align-items: flex-end; flex: 1; }
.cc-filter { min-width: 104px; }
.cc-filter label { display: block; font-size: 8px; text-transform: uppercase; letter-spacing: 0.7px; color: #7f95b2; margin-bottom: 3px; }
.cc-filter select {
  width: 100%; background: #0b1627; border: 1px solid #203554; color: #dbe7f5;
  border-radius: 5px; padding: 5px 7px; font-size: 10.5px; outline: none; cursor: pointer;
}
.cc-filter select:focus { border-color: #2b6ca3; box-shadow: 0 0 0 2px rgba(43, 108, 163, 0.18); }
.cc-header-right { display: flex; gap: 10px; margin-left: auto; align-items: stretch; }
.cc-clock { text-align: right; padding: 2px 4px; }
.cc-clock-date { font-size: 10px; color: #8ea3bf; }
.cc-clock-time { font-size: 21px; font-weight: 700; line-height: 1.15; font-variant-numeric: tabular-nums; letter-spacing: 0.3px; }
.cc-clock-zone { font-size: 8.5px; color: #7f95b2; }
.cc-zabbix {
  display: flex; align-items: center; gap: 9px; min-width: 158px;
  background: linear-gradient(180deg, rgba(9, 34, 25, 0.82), rgba(6, 20, 16, 0.82));
  border: 1px solid #1c4a36; border-radius: 8px; padding: 7px 10px;
}
.cc-zabbix-dot { width: 8px; height: 8px; border-radius: 50%; background: #00e676; box-shadow: 0 0 10px rgba(0, 230, 118, 0.9); flex: 0 0 auto; }
.cc-zabbix-label { font-size: 12px; font-weight: 800; letter-spacing: 0.6px; color: #9ff3c5; }
.cc-zabbix-sub { font-size: 8.5px; color: #6fbf94; margin-top: 1px; }
.cc-sample-badge {
  font-size: 7.5px; font-weight: 800; letter-spacing: 0.6px; color: #ffc107;
  border: 1px solid #5b4a14; background: rgba(255, 193, 7, 0.08); border-radius: 3px;
  padding: 1px 4px; margin-left: auto;
}
.cc-sample-badge.is-live { color: #00e676; border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-sample-badge.is-error { color: #ff4d67; border-color: #5b1c26; background: rgba(255, 77, 103, 0.08); }
.cc-zabbix.is-error {
  border-color: #5b1c26;
  background: linear-gradient(180deg, rgba(52, 10, 16, 0.82), rgba(26, 6, 9, 0.82));
}
.cc-zabbix.is-error .cc-zabbix-dot { background: #ff4d67; box-shadow: 0 0 10px rgba(255, 77, 103, 0.9); }
.cc-zabbix.is-loading .cc-zabbix-dot { background: #ffc107; box-shadow: 0 0 10px rgba(255, 193, 7, 0.9); animation: cc-pulse 1s infinite; }
.cc-zabbix.is-sample .cc-zabbix-dot { background: #ffc107; box-shadow: 0 0 8px rgba(255, 193, 7, 0.55); }
@keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.cc-mode { display: flex; align-self: center; border: 1px solid #1c314e; border-radius: 6px; overflow: hidden; }
.cc-mode button {
  background: #0b1728; color: #8ea3bf; border: 0; padding: 5px 9px;
  font-size: 8.5px; font-weight: 800; letter-spacing: 0.5px; cursor: pointer; font-family: inherit;
}
.cc-mode button:hover { color: #fff; }
.cc-mode button.active { background: #16324f; color: #fff; }
.cc-mode .cc-mode-note {
  padding: 5px 9px; font-size: 8.5px; font-weight: 800; letter-spacing: 0.5px;
  background: #16324f; color: #dfe9f6; white-space: nowrap;
}
.cc-banner {
  display: flex; gap: 8px; align-items: center; margin: 0 0 9px; padding: 7px 10px;
  border: 1px solid #5b1c26; border-radius: 6px; background: rgba(255, 61, 87, 0.08);
  color: #ffb3bf; font-size: 10px;
}
.cc-banner strong { color: #ff4d67; font-weight: 800; }
.cc-banner.warn { border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); color: #ffe08a; }
.cc-banner.warn strong { color: #ffc107; }
.cc-banner-btn {
  margin-left: auto; appearance: none; cursor: pointer; font-family: inherit;
  font-size: 9px; font-weight: 700; color: #ffe08a; background: rgba(255, 193, 7, 0.12);
  border: 1px solid #5b4a14; border-radius: 4px; padding: 4px 9px; white-space: nowrap;
}
.cc-banner-btn:hover { background: rgba(255, 193, 7, 0.2); }

.cc-kpis { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 8px; margin-bottom: 9px; }
.cc-kpi {
  position: relative; display: flex; gap: 8px; align-items: center;
  background: linear-gradient(180deg, #0a1526, #07101d);
  border: 1px solid #1a2c48; border-radius: 8px; padding: 8px 9px; min-height: 59px;
  overflow: hidden;
}
.cc-kpi::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: var(--tone); box-shadow: 0 0 12px var(--tone);
}
.cc-kpi-icon {
  width: 27px; height: 27px; border-radius: 5px; display: flex; align-items: center; justify-content: center;
  background: var(--tone-bg); color: var(--tone); flex: 0 0 auto;
}
.cc-kpi-body { min-width: 0; }
.cc-kpi-label { font-size: 7.8px; text-transform: uppercase; letter-spacing: 0.6px; color: #8ea3bf; white-space: nowrap; }
.cc-kpi-value { font-size: 21px; font-weight: 800; line-height: 1.15; font-variant-numeric: tabular-nums; letter-spacing: 0.2px; }
.cc-kpi-sub { font-size: 8.5px; color: #7f95b2; margin-top: 1px; white-space: nowrap; }
.cc-kpi-delta { font-size: 8px; font-weight: 700; margin-left: 3px; }
.cc-delta-up { color: #ff8a3d; }
.cc-delta-down { color: #00d47e; }
.cc-kpi-link {
  color: inherit; text-decoration: none; cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.cc-kpi-link:hover {
  border-color: #2f6ea8;
  background: linear-gradient(180deg, #0d1d33, #081422);
  box-shadow: 0 0 0 1px rgba(47, 155, 255, 0.18), 0 4px 14px rgba(0, 0, 0, 0.35);
}
.cc-kpi-link:focus-visible { outline: 2px solid #2f9bff; outline-offset: 1px; }
.cc-kpi-link::after {
  content: "\u203A"; position: absolute; top: 3px; right: 7px;
  font-size: 12px; line-height: 1; color: #5f83ad; opacity: 0.6;
}
.cc-kpi-link:hover::after { color: #9cc9ff; opacity: 1; }

.cc-util-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-panel {
  background: linear-gradient(180deg, #091426, #060e19);
  border: 1px solid #182a44; border-radius: 9px; overflow: hidden;
  min-width: 0;
}
.cc-panel-head {
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  padding: 7px 10px; border-bottom: 1px solid #14253c;
  background: linear-gradient(90deg, rgba(20, 40, 70, 0.35), transparent);
}
.cc-panel-title { font-size: 10.5px; font-weight: 700; letter-spacing: 0.45px; text-transform: uppercase; white-space: nowrap; }
.cc-panel-sub { font-size: 8.5px; color: #6f86a3; white-space: nowrap; }

.cc-util-body { display: flex; gap: 8px; padding: 8px 10px 9px; align-items: center; }
.cc-donut { position: relative; width: 88px; height: 88px; flex: 0 0 auto; }
.cc-donut svg { width: 100%; height: 100%; display: block; }
.cc-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cc-donut-value { font-size: 17px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.cc-donut-unit { font-size: 7.5px; color: #8ea3bf; margin-top: 2px; }
.cc-bars { display: flex; align-items: flex-end; gap: 2px; height: 52px; flex: 1; min-width: 34px; }
.cc-bar { flex: 1; min-width: 2px; border-radius: 1px 1px 0 0; opacity: 0.9; }
.cc-legend { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.cc-legend-row { display: flex; align-items: center; gap: 5px; font-size: 8.5px; color: #9db0c9; }
.cc-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto; }
.cc-legend-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-legend-value { font-weight: 700; color: #dbe7f5; font-variant-numeric: tabular-nums; }

.cc-groups { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-group { border-top: 2px solid var(--group); }
.cc-group-head { display: flex; align-items: center; gap: 8px; padding: 7px 10px 6px; }
.cc-group-name { font-size: 12.5px; font-weight: 800; letter-spacing: 0.45px; white-space: nowrap; }
.cc-group-total { font-size: 9.5px; color: #8ea3bf; }
.cc-group-chips { display: flex; gap: 5px; margin-left: auto; }
.cc-chip {
  display: inline-flex; align-items: center; gap: 3px; font-size: 8.5px; font-weight: 700;
  padding: 2px 5px; border-radius: 4px; background: #0c1a2c; border: 1px solid #1c314e;
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.cc-chip-green { color: #00e676; }
.cc-chip-yellow { color: #ffc107; }
.cc-chip-red { color: #ff4d67; }
.cc-chip-gray { color: #8ea3bf; }
.cc-grid-wrap { padding: 6px 10px 7px; }
.cc-tier-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; }
.cc-tier-label { width: 104px; flex: 0 0 auto; }
.cc-tier-title { font-size: 9.5px; font-weight: 700; white-space: nowrap; }
.cc-tier-sub { font-size: 8px; color: #6f86a3; white-space: nowrap; }
.cc-tier-counts { display: flex; gap: 4px; margin-top: 2px; }
.cc-tier-counts span { font-size: 7.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.cc-host-grid { display: flex; flex-wrap: wrap; gap: 2px; flex: 1; align-content: flex-start; min-height: 10px; }
.cc-cell { width: 8px; height: 8px; border-radius: 1.5px; opacity: 0.96; }
.cc-cell:hover { outline: 1px solid #fff; }
.cc-cell-btn {
  appearance: none; border: 0; padding: 0; font: inherit; cursor: pointer;
  transition: transform 0.1s ease;
}
.cc-cell-btn:hover { transform: scale(1.45); position: relative; z-index: 2; }
.cc-cell-btn:focus-visible { outline: 2px solid #fff; outline-offset: 1px; position: relative; z-index: 3; }
.cc-cell-healthy { background: #00d47e; }
.cc-cell-warning { background: #ffc107; }
.cc-cell-critical { background: #ff3d57; }
.cc-cell-stale { background: #67768a; }
.cc-cell-maintenance { background: #3b82f6; }
.cc-cell-unavailable { background: #9f1239; }
.cc-legend-inline {
  display: flex; flex-wrap: wrap; gap: 9px; padding: 5px 10px 7px;
  border-top: 1px solid #13243a; font-size: 7.8px; color: #7f95b2;
}
.cc-legend-inline span { display: inline-flex; align-items: center; gap: 4px; }

.cc-bottom { display: grid; grid-template-columns: 1.08fr 1.18fr 0.55fr 1.12fr; gap: 9px; margin-bottom: 9px; }
.cc-table-wrap { overflow-x: auto; }
.cc-table { width: 100%; border-collapse: collapse; font-size: 9px; }
.cc-table th {
  text-align: left; font-size: 7.4px; text-transform: uppercase; letter-spacing: 0.5px;
  color: #6f86a3; padding: 4px 6px; border-bottom: 1px solid #18304d; white-space: nowrap; font-weight: 700;
}
.cc-table td { padding: 4px 6px; border-bottom: 1px solid #101e31; white-space: nowrap; color: #b9c9dd; }
.cc-table tr:last-child td { border-bottom: 0; }
.cc-table tr:hover td { background: #0c1a2c; }
.cc-table tr.cc-row-link { cursor: pointer; }
.cc-table tr.cc-row-link:hover td { background: #0d2036; }
.cc-table tr.cc-row-link:focus-visible { outline: 2px solid #2f9bff; outline-offset: -2px; }
.cc-row-anchor {
  display: inline-flex; align-items: center; gap: 4px;
  color: #e6f0fb; text-decoration: none; font-weight: 700;
}
.cc-row-anchor:hover { color: #7fc4ff; text-decoration: underline; }
.cc-row-arrow { color: #5f83ad; font-size: 11px; line-height: 1; }
.cc-row-link:hover .cc-row-arrow { color: #9cc9ff; }
.cc-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.cc-status { font-weight: 800; font-size: 8.5px; }
.cc-status-critical { color: #ff4d67; }
.cc-status-high { color: #ff8a3d; }
.cc-status-warning { color: #ffc107; }
.cc-status-healthy { color: #00d47e; }
.cc-muted { color: #6f86a3; }
.cc-strong { color: #e6f0fb; font-weight: 700; }

.cc-freshness-body { display: flex; flex-direction: column; align-items: center; padding: 7px 8px 8px; }
.cc-freshness .cc-donut { width: 108px; height: 108px; }
.cc-freshness-legend { width: 100%; margin-top: 5px; display: flex; flex-direction: column; gap: 3px; }
.cc-freshness-legend .cc-legend-row { font-size: 8px; }

.cc-tabs { display: flex; gap: 4px; padding: 5px 8px; border-bottom: 1px solid #14253c; }
.cc-tab {
  font-size: 8.2px; padding: 3px 8px; border-radius: 4px; border: 1px solid #1c314e;
  background: #0b1728; color: #8ea3bf; cursor: pointer; font-weight: 700;
}
.cc-tab:hover { color: #dbe7f5; border-color: #2b5a86; }
.cc-tab.active { background: #16324f; color: #fff; border-color: #2b5a86; }
.cc-spark { width: 64px; height: 18px; display: block; }
.cc-bar-cell { display: flex; align-items: center; gap: 5px; }
.cc-mini-track { display: inline-block; width: 44px; height: 5px; border-radius: 3px; background: #12233a; overflow: hidden; }
.cc-mini-fill { display: block; height: 100%; border-radius: 3px; background: linear-gradient(90deg, #ffb020, #ff6b35); }

.cc-problems { margin-bottom: 2px; }
.cc-problem-tabs { display: flex; align-items: center; gap: 5px; padding: 6px 9px; border-bottom: 1px solid #14253c; }
.cc-problem-tabs .cc-spacer { flex: 1; }
.cc-problem-table { font-size: 8.8px; }
.cc-problem-table td { padding: 4px 6px; }
.cc-sev { font-weight: 800; text-transform: uppercase; font-size: 8px; letter-spacing: 0.2px; }
.cc-sev-critical { color: #ff4d67; }
.cc-sev-high { color: #ff8a3d; }
.cc-sev-warning { color: #ffc107; }
.cc-sev-info { color: #5fb0ff; }
.cc-duration { color: #ffc107; font-weight: 700; }
.cc-sla-within { color: #00e676; font-weight: 700; }
.cc-sla-risk { color: #ffc107; font-weight: 700; }
.cc-sla-breach { color: #ff4d67; font-weight: 700; }
.cc-ack-yes { color: #00d47e; }
.cc-ack-no { color: #ff4d67; }
.cc-related { color: #7fc4ff; }
.cc-footer { display: flex; justify-content: space-between; color: #5f7591; font-size: 8px; padding: 6px 2px 0; }

.cc-modal-backdrop {
  position: fixed; inset: 0; z-index: 1080; display: flex; align-items: flex-start;
  justify-content: center; padding: 22px 16px; overflow-y: auto;
  background: rgba(2, 7, 14, 0.78); backdrop-filter: blur(3px);
}
.cc-modal {
  position: relative; display: flex; flex-direction: column; width: min(1000px, 100%);
  max-height: calc(100vh - 44px); margin: auto; overflow: hidden;
  background: linear-gradient(180deg, #0a1628, #060e19);
  border: 1px solid #274663; border-radius: 11px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  animation: cc-modal-in 0.15s ease-out;
}
@keyframes cc-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: none; }
}
.cc-modal-head {
  display: flex; gap: 16px; justify-content: space-between; align-items: flex-start;
  padding: 14px 18px 12px; border-bottom: 1px solid #1b3451;
  background: linear-gradient(90deg, rgba(24, 54, 88, 0.45), transparent);
}
.cc-modal-kicker {
  display: flex; align-items: center; gap: 8px; font-size: 8px; font-weight: 800;
  letter-spacing: 1px; color: #7f95b2; text-transform: uppercase;
}
.cc-modal-source {
  font-size: 7.5px; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.6px;
  border: 1px solid #1c4a36; color: #00e676; background: rgba(0, 230, 118, 0.08);
}
.cc-modal-source.sample {
  color: #ffc107; border-color: #5b4a14; background: rgba(255, 193, 7, 0.08);
}
.cc-modal-title {
  font-size: 23px; font-weight: 800; line-height: 1.1; margin-top: 5px;
  letter-spacing: 0.2px; word-break: break-word;
}
.cc-modal-sub { font-size: 9.5px; color: #8ea3bf; margin-top: 5px; }
.cc-modal-close {
  appearance: none; border: 1px solid #24405f; background: #0b1728; color: #9db0c9;
  width: 30px; height: 30px; border-radius: 6px; font-size: 20px; line-height: 1;
  cursor: pointer; flex: 0 0 auto; font-family: inherit;
}
.cc-modal-close:hover { color: #fff; border-color: #2f6ea8; background: #10233a; }
.cc-modal-body { overflow-y: auto; padding: 13px 18px 16px; }
.cc-metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-metric-card {
  background: linear-gradient(180deg, #0b182b, #07111e); border: 1px solid #1a2c48;
  border-radius: 8px; padding: 9px 10px 7px; min-width: 0;
}
.cc-gauge { position: relative; width: 100%; max-width: 150px; margin: 0 auto; }
.cc-gauge svg { display: block; width: 100%; height: auto; }
.cc-gauge-center {
  position: absolute; left: 0; right: 0; bottom: 2px; text-align: center;
  display: flex; align-items: baseline; justify-content: center; gap: 2px;
}
.cc-gauge-center strong { font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums; }
.cc-gauge-center span { font-size: 9px; color: #8ea3bf; }
.cc-metric-info { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.cc-metric-name { font-size: 8.5px; font-weight: 700; color: #dbe7f5; }
.cc-metric-band {
  font-size: 7.5px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.4px; margin-left: auto;
}
.cc-metric-fleet { width: 100%; font-size: 8px; color: #7f95b2; }
.cc-detail-spark { width: 100%; height: 38px; display: block; margin-top: 5px; }
.cc-detail-spark-empty {
  height: 38px; display: flex; align-items: center; justify-content: center;
  font-size: 8px; color: #5f7591; border-top: 1px dashed #14253c; margin-top: 5px;
}
.cc-metric-foot { font-size: 7.5px; color: #5f7591; margin-top: 3px; text-align: right; }
.cc-detail-grid { display: grid; grid-template-columns: 1.08fr 1fr 0.86fr; gap: 9px; margin-bottom: 9px; }
.cc-detail-panel-body { padding: 8px 10px 9px; }
.cc-fs-list { display: flex; flex-direction: column; gap: 7px; }
.cc-fs-row { display: flex; align-items: center; gap: 7px; }
.cc-fs-mount {
  width: 52px; flex: 0 0 auto; font-size: 8.5px; color: #b9c9dd;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cc-fs-value {
  width: 32px; flex: 0 0 auto; text-align: right; font-size: 8.5px;
  font-weight: 800; font-variant-numeric: tabular-nums;
}
.cc-usage-track { position: relative; flex: 1; height: 7px; border-radius: 4px; background: #12233a; overflow: hidden; }
.cc-usage-track > span { display: block; height: 100%; border-radius: 4px; }
.cc-usage-track > i {
  position: absolute; top: -2px; bottom: -2px; width: 1.5px;
  background: #dbe7f5; opacity: 0.7;
}
.cc-fs-legend { display: flex; gap: 10px; margin-top: 4px; font-size: 7.5px; color: #7f95b2; flex-wrap: wrap; }
.cc-fs-legend span { display: inline-flex; align-items: center; gap: 4px; }
.cc-fs-legend i { width: 6px; height: 6px; border-radius: 2px; display: inline-block; }
.cc-cmp-list { display: flex; flex-direction: column; gap: 7px; }
.cc-cmp-row { min-width: 0; }
.cc-cmp-top {
  display: flex; justify-content: space-between; gap: 6px;
  font-size: 8px; color: #b9c9dd; margin-bottom: 3px;
}
.cc-cmp-top .cc-muted { white-space: nowrap; }
.cc-cmp-legend { font-size: 7.5px; color: #5f7591; margin-top: 2px; }
.cc-facts { display: grid; grid-template-columns: 1fr; gap: 0; margin: 0; }
.cc-facts > div {
  display: flex; justify-content: space-between; gap: 8px;
  padding: 3px 0; border-bottom: 1px solid #101e31; font-size: 8.2px;
}
.cc-facts > div:last-child { border-bottom: 0; }
.cc-facts dt { color: #7f95b2; margin: 0; }
.cc-facts dd { color: #dbe7f5; margin: 0; text-align: right; font-weight: 600; }
.cc-modal-health {
  display: inline-block; border: 1px solid; border-radius: 3px; padding: 1px 5px;
  font-size: 7.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;
}
.cc-detail-empty { padding: 16px 8px; text-align: center; font-size: 9px; color: #7f95b2; }
.cc-detail-problems { font-size: 8.6px; }
.cc-detail-problem-name { max-width: 420px; overflow: hidden; text-overflow: ellipsis; }
.cc-modal-foot {
  display: flex; align-items: center; gap: 12px; justify-content: space-between;
  padding: 8px 18px; border-top: 1px solid #1b3451; background: #07111e;
  font-size: 8px; color: #5f7591; flex-wrap: wrap;
}
.cc-detail-note { flex: 1; min-width: 200px; }
.cc-detail-note.error { color: #ffb3bf; }
.cc-detail-note.partial { color: #ffc107; }
.cc-modal-link { color: #7fc4ff; text-decoration: none; font-weight: 700; white-space: nowrap; }
.cc-modal-link:hover { color: #fff; }

@media (max-width: 1000px) {
  .cc-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-detail-grid { grid-template-columns: 1fr; }
}
@media (max-width: 620px) {
  .cc-modal-backdrop { padding: 0; }
  .cc-modal { max-height: 100vh; border-radius: 0; border-left: 0; border-right: 0; }
  .cc-modal-head, .cc-modal-body, .cc-modal-foot { padding-left: 12px; padding-right: 12px; }
  .cc-modal-title { font-size: 18px; }
  .cc-fs-mount { width: 44px; }
}

@media (max-width: 1500px) {
  .cc-kpis { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .cc-bottom { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 1200px) {
  .cc-util-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-groups { grid-template-columns: 1fr; }
  .cc-header-right { margin-left: 0; }
}
@media (max-width: 760px) {
  .cc-app { padding: 10px; }
  .cc-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-util-row, .cc-bottom { grid-template-columns: 1fr; }
  .cc-title { font-size: 20px; white-space: normal; }
  .cc-subtitle { white-space: normal; }
}
`;

      const ALL$1 = "All";
      const ALL_FILTERS$1 = {
        environment: ALL$1,
        tier: ALL$1,
        hostGroup: ALL$1,
        os: ALL$1,
        businessService: ALL$1
      };
      const TIER_SUBTITLE = {
        "Tier 1": "Core Banking",
        "Tier 2": "Business Critical",
        "Tier 3": "Supporting"
      };
      const fmt = (n) => n.toLocaleString("en-US");
      const pct = (n) => `${n.toFixed(1)}%`;
      function initialFilters() {
        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const pick = (key, allowed) => {
          const value = params ? params.get(key) : null;
          return value && (!allowed || allowed.includes(value)) ? value : ALL$1;
        };
        return {
          environment: pick("environment", ["PROD", "DR", "UAT"]),
          tier: pick("tier", ["Tier 1", "Tier 2", "Tier 3"]),
          hostGroup: pick("hostGroup"),
          os: pick("os"),
          businessService: pick("businessService")
        };
      }
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
      function CommandCenterPage({ initialConfig } = {}) {
        const sample = useMemo(() => buildSampleData(), []);
        const empty = useMemo(() => emptySampleData(), []);
        const canGoLive = useMemo(() => isGrafanaHosted(), []);
        const [sampleEnabled, setSampleEnabled] = useState(initialConfig ? initialConfig.sampleDataEnabled : true);
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
        const [refreshSeconds, setRefreshSeconds] = useState(
          initialConfig ? initialConfig.refreshSeconds : DEFAULT_ZABBIX_CONFIG.refreshSeconds
        );
        const sourceTouched = useRef(false);
        const staleFiltersCleared = useRef(isStaleSampleLink(initialConfig));
        const [filters, setFilters] = useState(
          () => staleFiltersCleared.current ? { ...ALL_FILTERS$1 } : initialFilters()
        );
        const [now, setNow] = useState(/* @__PURE__ */ new Date());
        const [resource, setResource] = useState("cpu");
        const [problemTab, setProblemTab] = useState("All");
        const [selectedHost, setSelectedHost] = useState(null);
        useEffect(() => {
          const timer = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
          return () => window.clearInterval(timer);
        }, []);
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
            if (!config.sampleDataEnabled) {
              sourceTouched.current = true;
              setSource("live");
              if (!staleFiltersCleared.current && isStaleSampleLink(config)) {
                staleFiltersCleared.current = true;
                setFilters({ ...ALL_FILTERS$1 });
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
          if (source !== "live") {
            return;
          }
          let cancelled = false;
          setLiveState("loading");
          setLiveError(null);
          fetchZabbixData().then((result) => {
            if (!cancelled) {
              setLive(result);
              setLiveState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setLiveError(err.message || "Unable to reach the Zabbix API");
              setLiveState("error");
            }
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
          setFilters({ environment: ALL$1, tier: ALL$1, hostGroup: ALL$1, os: ALL$1, businessService: ALL$1 });
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
        const filteredHosts = useMemo(() => data.hosts.filter((h) => matchesFilters(h, filters)), [data.hosts, filters]);
        const hostByHostname = useMemo(() => new Map(data.hosts.map((h) => [h.hostname, h])), [data.hosts]);
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
        const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;
        const filtersActive = Object.values(filters).some((v) => v !== ALL$1);
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
        const safeTotal = total || 1;
        const safeProblems = totalProblems || 1;
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
        const freshness = useMemo(
          () => ({
            upToDate: filteredHosts.filter((h) => h.dataState === "upToDate").length,
            stale: filteredHosts.filter((h) => h.dataState === "stale").length,
            noData: filteredHosts.filter((h) => h.dataState === "noData").length,
            notMonitored: filteredHosts.filter((h) => h.dataState === "notMonitored").length
          }),
          [filteredHosts]
        );
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
        const inventoryHrefFor = (scope, filterSet, host) => {
          if (!canGoLive) {
            return void 0;
          }
          const params = new URLSearchParams({ scope, source: effectiveSource });
          if (host) {
            params.set("host", host);
          }
          Object.keys(filterSet).forEach((key) => {
            if (filterSet[key] !== ALL$1) {
              params.set(key, filterSet[key]);
            }
          });
          return `${appSubUrl()}/a/acme-command-center-app/servers?${params.toString()}`;
        };
        const drillHref = (scope, host) => inventoryHrefFor(scope, filters, host);
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
        const problemCounts = useMemo(
          () => ({
            All: filteredProblems.length,
            Critical: filteredProblems.filter((p) => p.severityGroup === "Critical").length,
            Warning: filteredProblems.filter((p) => p.severityGroup === "Warning").length,
            Info: filteredProblems.filter((p) => p.severityGroup === "Info").length
          }),
          [filteredProblems]
        );
        return /* @__PURE__ */ React.createElement("div", { className: "cc-app" }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement(
          Header,
          {
            filters,
            onChange,
            options,
            now,
            source,
            onSource,
            connection,
            version: live?.version,
            hostCount: live?.data.hosts.length,
            lastSync: live?.fetchedAt.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Singapore" }),
            canGoLive,
            sampleEnabled
          }
        ), source === "live" && connection === "error" ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner" }, /* @__PURE__ */ React.createElement("strong", null, "ZABBIX UNREACHABLE"), /* @__PURE__ */ React.createElement("span", null, liveError || "Unable to reach the Zabbix API."), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { marginLeft: "auto" } }, live ? "Showing last successful sync" : sampleEnabled ? "Showing sample data" : "No live data available")) : null, source === "live" && live && data.hosts.length > 0 && filtersActive && filteredHosts.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner warn" }, /* @__PURE__ */ React.createElement("strong", null, "NO SERVERS MATCH FILTERS"), /* @__PURE__ */ React.createElement("span", null, "Active filters exclude all ", fmt(data.hosts.length), " live server", data.hosts.length === 1 ? "" : "s", "."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-banner-btn", onClick: () => setFilters({ ...ALL_FILTERS$1 }) }, "Clear filters")) : null, /* @__PURE__ */ React.createElement("div", { className: "cc-kpis" }, /* @__PURE__ */ React.createElement(
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
            value: fmt(warning),
            sub: pct(warning / safeTotal * 100),
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
            value: fmt(critical),
            sub: pct(critical / safeTotal * 100),
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
            value: fmt(totalProblems),
            sub: `${fmt(unacknowledged)} unacknowledged`,
            tone: "purple",
            href: drillHref("problems")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "bell-off",
            label: "UNACKNOWLEDGED",
            value: fmt(unacknowledged),
            sub: pct(unacknowledged / safeProblems * 100),
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
            tone: "blue",
            href: drillHref("maintenance")
          }
        ), /* @__PURE__ */ React.createElement(
          Kpi,
          {
            icon: "db",
            label: "STALE / NO DATA",
            value: fmt(stale),
            sub: pct(stale / safeTotal * 100),
            tone: "gray",
            href: drillHref("stale")
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "cc-util-row" }, /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "CPU Utilisation (All Servers)",
            sub: "All Servers",
            avg: utilization.cpu.avg,
            critical: utilization.cpu.critical,
            warning: utilization.cpu.warning,
            normal: utilization.cpu.normal,
            accent: "#2f9bff"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Memory Utilisation (All Servers)",
            sub: "All Servers",
            avg: utilization.memory.avg,
            critical: utilization.memory.critical,
            warning: utilization.memory.warning,
            normal: utilization.memory.normal,
            accent: "#8b5cf6"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Disk Utilisation (All Filesystems)",
            sub: "All Filesystems",
            avg: utilization.disk.avg,
            critical: utilization.disk.critical,
            warning: utilization.disk.warning,
            normal: utilization.disk.normal,
            accent: "#00d47e"
          }
        ), /* @__PURE__ */ React.createElement(
          UtilCard,
          {
            title: "Network Utilisation (All Interfaces)",
            sub: "All Interfaces",
            avg: utilization.network.avg,
            critical: utilization.network.critical,
            warning: utilization.network.warning,
            normal: utilization.network.normal,
            accent: "#00d4ff"
          }
        )), /* @__PURE__ */ React.createElement(GroupGrids, { groups, onSelect: setSelectedHost }), /* @__PURE__ */ React.createElement("div", { className: "cc-bottom" }, /* @__PURE__ */ React.createElement(BusinessServicesTable, { rows: serviceRows, href: serviceDrillHref }), /* @__PURE__ */ React.createElement(DrTable, { rows: data.drComponents, href: drDrillHref }), /* @__PURE__ */ React.createElement(FreshnessPanel, { counts: freshness, total }), /* @__PURE__ */ React.createElement(TopServersPanel, { rows: topServers, resource, onResource: setResource })), /* @__PURE__ */ React.createElement(
          ProblemsTable,
          {
            problems: filteredProblems,
            tab: problemTab,
            onTab: setProblemTab,
            counts: problemCounts,
            source: effectiveSource,
            refreshSeconds
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

      const ALL = "All";
      const PAGE_SIZES = [25, 50, 100, 250];
      const ALL_FILTERS = {
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
          blurb: "Newest item value is 5\u201310 minutes old (stale) or older than 10 minutes (no data)."
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
.cc-srv-head { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 14px; }
.cc-srv-back {
  display: inline-flex; align-items: center; gap: 5px; color: #7fc4ff; text-decoration: none;
  font-size: 11px; padding: 6px 9px; border: 1px solid #1c314e; border-radius: 5px;
  background: #0b1728; white-space: nowrap;
}
.cc-srv-back:hover { border-color: #2b6ca3; color: #fff; }
.cc-srv-titles { min-width: 240px; }
.cc-srv-title { font-size: 20px; font-weight: 800; letter-spacing: 0.5px; line-height: 1; }
.cc-srv-sub { font-size: 10px; color: #8ea3bf; margin-top: 6px; max-width: 760px; }
.cc-srv-sub strong { color: #dbe7f5; }
.cc-srv-actions { margin-left: auto; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.cc-srv-btn {
  appearance: none; font-family: inherit; cursor: pointer; font-size: 9.5px; font-weight: 700;
  color: #dbe7f5; background: #0b1728; border: 1px solid #1c314e; border-radius: 5px;
  padding: 6px 10px; letter-spacing: 0.2px;
}
.cc-srv-btn:hover { border-color: #2b6ca3; background: #10233a; }
.cc-srv-btn:disabled { opacity: 0.5; cursor: default; }
.cc-srv-badge {
  font-size: 8px; font-weight: 800; letter-spacing: 0.6px; padding: 3px 7px;
  border-radius: 3px; border: 1px solid #1c314e; color: #8ea3bf;
}
.cc-srv-badge.live { color: #00e676; border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-srv-badge.sample { color: #ffc107; border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); }
.cc-srv-filters { display: flex; gap: 9px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 10px; }
.cc-srv-search { min-width: 230px; }
.cc-srv-search label { display: block; font-size: 8px; text-transform: uppercase; letter-spacing: 0.7px; color: #7f95b2; margin-bottom: 3px; }
.cc-srv-search input {
  width: 100%; background: #0b1627; border: 1px solid #203554; color: #dbe7f5;
  border-radius: 5px; padding: 5px 7px; font-size: 10.5px; outline: none; font-family: inherit;
}
.cc-srv-search input:focus { border-color: #2b6ca3; box-shadow: 0 0 0 2px rgba(43, 108, 163, 0.18); }
.cc-srv-hostchip {
  display: inline-flex; align-items: center; gap: 5px; font-size: 9px; color: #9db0c9;
  background: #0b1728; border: 1px solid #24405f; border-radius: 5px;
  padding: 5px 6px 5px 8px;
}
.cc-srv-hostchip strong { color: #dbe7f5; }
.cc-srv-hostchip button {
  appearance: none; border: 0; background: transparent; color: #7fc4ff; cursor: pointer;
  font-size: 13px; line-height: 1; padding: 0 2px; font-family: inherit;
}
.cc-srv-table { font-size: 9.5px; }
.cc-srv-table td { padding: 5px 7px; }
.cc-srv-table .hostname { color: #e6f0fb; font-weight: 700; }
.cc-srv-health { font-weight: 800; font-size: 8.3px; text-transform: uppercase; letter-spacing: 0.2px; }
.cc-h-healthy { color: #00d47e; }
.cc-h-warning { color: #ffc107; }
.cc-h-critical { color: #ff4d67; }
.cc-h-stale { color: #8ea3bf; }
.cc-h-maintenance { color: #5fb0ff; }
.cc-h-unavailable { color: #ff8a3d; }
.cc-srv-util { text-align: right; font-variant-numeric: tabular-nums; }
.cc-srv-util.hot { color: #ff4d67; font-weight: 700; }
.cc-srv-util.warm { color: #ffc107; }
.cc-srv-problem { max-width: 300px; overflow: hidden; text-overflow: ellipsis; }
.cc-srv-pager {
  display: flex; align-items: center; gap: 10px; justify-content: flex-end; flex-wrap: wrap;
  padding: 7px 10px; border-top: 1px solid #14253c; color: #8ea3bf; font-size: 9px;
}
.cc-srv-pager select {
  background: #0b1627; border: 1px solid #203554; color: #dbe7f5; border-radius: 5px;
  padding: 3px 6px; font-size: 9px; font-family: inherit; cursor: pointer;
}
.cc-srv-empty { padding: 34px 20px; text-align: center; color: #8ea3bf; font-size: 11px; }
.cc-srv-error { color: #ffb3bf; }
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
        const text = String(value);
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
      }
      function ServerListPage({
        query,
        initialConfig
      }) {
        const scope = useMemo(() => parseScope(queryParam(query, "scope")), [query]);
        const requestedSource = queryParam(query, "source") === "live" ? "live" : "sample";
        const canGoLive = useMemo(() => isGrafanaHosted(), []);
        const [sampleEnabled, setSampleEnabled] = useState(
          initialConfig ? initialConfig.sampleDataEnabled : true
        );
        useEffect(() => {
          if (!canGoLive) {
            return;
          }
          let cancelled = false;
          loadZabbixConfig().then((config) => {
            if (!cancelled) {
              setSampleEnabled(config.sampleDataEnabled);
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
        useEffect(() => {
          if (source !== "live") {
            return;
          }
          let cancelled = false;
          setLiveState("loading");
          setLiveError(null);
          fetchZabbixData().then((result) => {
            if (!cancelled) {
              setLive(result);
              setLiveState("ready");
            }
          }).catch((err) => {
            if (!cancelled) {
              setLiveError(err.message || "Unable to reach the Zabbix API");
              setLiveState("error");
            }
          });
          return () => {
            cancelled = true;
          };
        }, [source, tick]);
        const data = source === "live" ? live ? live.data : null : sample;
        const staleSampleLink = useRef(
          requestedSource === "sample" && !(initialConfig ? initialConfig.sampleDataEnabled : true)
        );
        const [filters, setFilters] = useState(
          () => staleSampleLink.current ? { ...ALL_FILTERS } : parseFilters(query)
        );
        const [hostFilter, setHostFilter] = useState(
          () => staleSampleLink.current ? null : queryParam(query, "host")
        );
        useEffect(() => {
          if (!sampleEnabled && requestedSource === "sample" && !staleSampleLink.current) {
            staleSampleLink.current = true;
            setFilters({ ...ALL_FILTERS });
            setHostFilter(null);
          }
        }, [sampleEnabled, requestedSource]);
        const [search, setSearch] = useState("");
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(50);
        const hosts = data ? data.hosts : [];
        const problems = data ? data.problems : [];
        const filteredHosts = useMemo(() => hosts.filter((h) => matchesFilters(h, filters)), [hosts, filters]);
        const hostByHostname = useMemo(() => new Map(hosts.map((h) => [h.hostname, h])), [hosts]);
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
        const backHref = `${appSubUrl()}/a/acme-command-center-app/command-center?${backParams.toString()}`;
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
        const header = /* @__PURE__ */ React.createElement("div", { className: "cc-srv-head" }, /* @__PURE__ */ React.createElement("a", { className: "cc-srv-back", href: backHref }, "\u2190 Command Center"), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-titles" }, /* @__PURE__ */ React.createElement("div", { className: "cc-srv-title" }, "SERVER INVENTORY"), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-sub" }, /* @__PURE__ */ React.createElement("strong", null, meta.title), " \u2014 ", meta.blurb, " ", scopeProblems.length > 0 || meta.problems ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, scopeProblems.length), " problem", scopeProblems.length === 1 ? "" : "s", " across", " ", /* @__PURE__ */ React.createElement("strong", null, visibleHosts.length), " server", visibleHosts.length === 1 ? "" : "s", ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, visibleHosts.length), " server", visibleHosts.length === 1 ? "" : "s", "."))), /* @__PURE__ */ React.createElement("div", { className: "cc-srv-actions" }, /* @__PURE__ */ React.createElement("span", { className: `cc-srv-badge ${source === "live" ? "live" : "sample"}` }, sourceBadge), live ? /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { fontSize: 9 } }, "sync ", live.fetchedAt.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Singapore" })) : null, source === "live" ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: () => setTick((t) => t + 1), disabled: liveState === "loading" }, liveState === "loading" ? "Refreshing\u2026" : "Refresh") : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: exportCsv, disabled: !data || visibleHosts.length === 0 }, "Export CSV")));
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
        )), hostFilter ? /* @__PURE__ */ React.createElement("span", { className: "cc-srv-hostchip" }, "Host: ", /* @__PURE__ */ React.createElement("strong", null, hostFilter), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: clearHostFilter, "aria-label": "Clear host filter" }, "\xD7")) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: resetFilters }, "Reset"));
        const body = !data ? /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: `cc-srv-empty ${liveState === "error" ? "cc-srv-error" : ""}` }, liveState === "error" ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Could not load live Zabbix data: ", liveError, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cc-srv-btn", onClick: () => setTick((t) => t + 1) }, "Retry"))) : "Loading live data from Zabbix\u2026")) : /* @__PURE__ */ React.createElement("div", { className: "cc-panel" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-head" }, /* @__PURE__ */ React.createElement("div", { className: "cc-panel-title" }, meta.title), /* @__PURE__ */ React.createElement("div", { className: "cc-panel-sub" }, visibleHosts.length, " server", visibleHosts.length === 1 ? "" : "s", scopeProblems.length > 0 ? ` \xB7 ${scopeProblems.length} problem${scopeProblems.length === 1 ? "" : "s"}` : "")), /* @__PURE__ */ React.createElement("div", { className: "cc-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "cc-table cc-srv-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "#"), /* @__PURE__ */ React.createElement("th", null, "Hostname"), /* @__PURE__ */ React.createElement("th", null, "Environment"), /* @__PURE__ */ React.createElement("th", null, "Tier"), /* @__PURE__ */ React.createElement("th", null, "Host Group"), /* @__PURE__ */ React.createElement("th", null, "OS"), /* @__PURE__ */ React.createElement("th", null, "Business Service"), /* @__PURE__ */ React.createElement("th", null, "Health"), /* @__PURE__ */ React.createElement("th", null, "Data"), /* @__PURE__ */ React.createElement("th", null, "Last Seen"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "CPU"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Memory"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Disk"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Network"), /* @__PURE__ */ React.createElement("th", { className: "num" }, "Problems"), /* @__PURE__ */ React.createElement("th", null, "Latest Problem"))), /* @__PURE__ */ React.createElement("tbody", null, pageRows.map((h, index) => {
          const hostProblems = problemsByHost.get(h.hostname) || [];
          const unack = hostProblems.filter((p) => !p.ack).length;
          const latest = hostProblems.slice().sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
          return /* @__PURE__ */ React.createElement("tr", { key: h.id, className: "cc-srv-row" }, /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, (currentPage - 1) * pageSize + index + 1), /* @__PURE__ */ React.createElement("td", { className: "hostname" }, h.hostname), /* @__PURE__ */ React.createElement("td", null, h.environment), /* @__PURE__ */ React.createElement("td", null, h.tier), /* @__PURE__ */ React.createElement("td", null, h.hostGroup), /* @__PURE__ */ React.createElement("td", null, h.os), /* @__PURE__ */ React.createElement("td", null, h.businessService), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: `cc-srv-health ${HEALTH_CLASS[h.health]}` }, h.health)), /* @__PURE__ */ React.createElement("td", null, DATA_STATE_LABEL[h.dataState]), /* @__PURE__ */ React.createElement("td", { className: "cc-muted" }, h.lastSeenMin >= 9999 ? "\u2014" : `${h.lastSeenMin}m`), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.cpu) }, h.cpu.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.memory) }, h.memory.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.disk) }, h.disk.toFixed(0), "%"), /* @__PURE__ */ React.createElement("td", { className: utilClass(h.network) }, h.network.toFixed(1), "%"), /* @__PURE__ */ React.createElement("td", { className: "num" }, hostProblems.length, unack > 0 ? /* @__PURE__ */ React.createElement("span", { className: "cc-muted" }, " (", unack, " unack)") : null), /* @__PURE__ */ React.createElement("td", { className: "cc-srv-problem" }, latest ? /* @__PURE__ */ React.createElement("span", { className: `cc-sev cc-sev-${latest.severity.toLowerCase()}`, title: `${latest.problem} \xB7 ${latest.time} \xB7 ${latest.duration}` }, latest.problem) : /* @__PURE__ */ React.createElement("span", { className: "cc-muted" }, "\u2014")));
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
        return /* @__PURE__ */ React.createElement("div", { className: "cc-app cc-srv" }, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("style", null, SRV_CSS), header, filterBar, source === "live" && liveState === "error" && live ? /* @__PURE__ */ React.createElement("div", { className: "cc-banner" }, /* @__PURE__ */ React.createElement("strong", null, "ZABBIX UNREACHABLE"), /* @__PURE__ */ React.createElement("span", null, liveError || "Unable to reach the Zabbix API."), /* @__PURE__ */ React.createElement("span", { className: "cc-muted", style: { marginLeft: "auto" } }, "Showing last successful sync")) : null, body);
      }

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
        const endpoint = useMemo(() => zabbixEndpoint(config, "api"), [config]);
        const proxyBase = appSubUrl() || "";
        const onSave = async () => {
          setSaving(true);
          setStatus(null);
          try {
            await saveZabbixConfig(config);
            setStatus({
              tone: "ok",
              text: "Connection settings saved. The dashboard picks them up on its next refresh; reload it to apply a new refresh interval."
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
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Enter the Zabbix server IP or hostname; ", /* @__PURE__ */ React.createElement("code", null, "/api_jsonrpc.php"), " is appended automatically (HTTP is assumed when no scheme is given). A full endpoint such as", " ", /* @__PURE__ */ React.createElement("code", null, "https://zabbix.example/zabbix/api_jsonrpc.php"), " or a same-origin", " ", /* @__PURE__ */ React.createElement("code", null, "/api_jsonrpc.php"), " is also accepted. Effective endpoint:", " ", /* @__PURE__ */ React.createElement("code", null, endpoint)), /* @__PURE__ */ React.createElement("label", { htmlFor: "cc-auth-method" }, "Authentication"), /* @__PURE__ */ React.createElement(
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
        ), /* @__PURE__ */ React.createElement("p", { className: "help" }, "Used for ", /* @__PURE__ */ React.createElement("code", null, "apiinfo.version"), ", which Zabbix rejects when an Authorization header is present. Still guarded by the Grafana session check.")), /* @__PURE__ */ React.createElement("fieldset", null, /* @__PURE__ */ React.createElement("legend", null, "Dashboard behaviour"), /* @__PURE__ */ React.createElement("label", { className: "inline", htmlFor: "cc-sample-data" }, /* @__PURE__ */ React.createElement(
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
        if (/\/servers\/?$/.test(path)) {
          return /* @__PURE__ */ React.createElement(ServerListPage, { query: props && props.query, initialConfig });
        }
        return /* @__PURE__ */ React.createElement(CommandCenterPage, { initialConfig });
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
