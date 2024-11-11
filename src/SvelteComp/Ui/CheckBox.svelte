<script lang="ts">
    export let disabled = false;
    export let checked = false;
    export let minus = false;
    export let classes = '';
    export let onChange = null;
  
    const changeMs: number = 0;
  </script>
  
  <label class:disabled class="label {classes}">
    <input
      class="real-checkbox"
      on:change
      on:change="{() => onChange && setTimeout(() => onChange(checked), changeMs)}"
      bind:checked
      {disabled}
      type="checkbox" />
    <div class="wrap">
      <span class:minus class="checkbox"></span>
    </div>
    <div>
      <slot />
    </div>
  </label>
  
  <style>
    .label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .label.disabled {
      opacity: 0.65;
      cursor: default;
    }
    .wrap {
      padding: 0;
      margin: 0;
      margin-right: 7px;
    }
    .real-checkbox {
      position: absolute;
      opacity: 0;
      width: 20px;
      height: 20px;
    }
    .checkbox {
      position: relative;
      width: 18px;
      height: 18px;
      display: inline-flex;
      background-color: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      background-repeat: no-repeat;
    }
  
    .real-checkbox:disabled ~ .wrap .checkbox {
      background-color: #f1f1f1;
    }
  
    .real-checkbox:checked ~ .wrap .checkbox:not(.minus) {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfeDIwMTRfX0l0ZW1fMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTIgMTEiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEyIDExIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJjaGVjay5zdmciPg0KCTxnPg0KCQk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzJFMzY0MCIgZD0iTTExLjQ3NiwwLjE1MWMtMC4zNzctMC4yOTYtMC45OTctMC4xMzktMS4zNTksMC4zMjRMNS4xNTMsNi41Mw0KCQkJQzUuMDc3LDYuNjI0LDQuODg0LDYuNjU3LDQuNzg1LDYuNTk1TDEuNzIzLDQuNjg4QzEuMjQsNC4zNDIsMC42MjQsNC4zNjYsMC4zNDksNC43NTNjLTAuMjY4LDAuMzc4LTAuMTgsMC45OTQsMC4yMDksMS40NjQNCgkJCWwzLjUwOSw0LjIzNEM0LjM2MSwxMC44MDUsNC43NDIsMTEsNS4xNCwxMWMwLjQ2NSwwLDAuODk1LTAuMjY2LDEuMTc3LTAuNzI4bDUuMjY0LTguNjE1QzExLjkxNiwxLjEwOSwxMS44NzEsMC40NjIsMTEuNDc2LDAuMTUxDQoJCQl6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=);
      background-size: 70%;
      background-position: center;
    }
    .checkbox.minus {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gDTwhLS0gR2VuZXJhdGVkIGJ5IExheWVyaGVybyBTVkcgRXhwb3J0ZXI6IGh0dHA6Ly93d3cubGF5ZXJoZXJvLmNvbS9waG90b3Nob3Atc3ZnLWV4cG9ydGVyIC0tPg08IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg08c3ZnIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOmV2PSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHMiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgMTAgNCI+DTxnIHRyYW5zZm9ybT0ic2NhbGUoTmFOKSIgPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgIGZpbGw9InJnYiggNDYsIDU0LCA2NCApIg0gZD0iTS0wLjQ0NCwwLjExMSBDLTAuNDQ0LDAuMTExIDEuODA5LC0wLjEzOSA0LjA0NiwtMC4xMzkgQzYuMjUzLC0wLjEzOSA4LjQ0NSwwLjExMSA4LjQ0NSwwLjExMSBDOC40NDUsMC4xMTEgOC40NDUsMS41ODMgOC40NDUsMS41ODMgQzguNDQ1LDEuNTgzIDYuMzA1LDIuMDU2IDQuMTI1LDIuMDU2IEMxLjg2MiwyLjA1NiAtMC40NDQsMS41ODMgLTAuNDQ0LDEuNTgzIEMtMC40NDQsMS41ODMgLTAuNDQ0LDAuMTExIC0wLjQ0NCwwLjExMSBaIi8+DTwvZz48L3N2Zz4N);
      background-size: 75%;
      background-position: 75% 60%;
    }
  </style>
  