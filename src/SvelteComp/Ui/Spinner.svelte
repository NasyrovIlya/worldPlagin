<script lang="ts">
  
</script>

<div class="wrap">
  <div class="sp"></div>
</div>

<style>
  .wrap {
    padding: 14px 0px 5px 0px;
    margin: 10px auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sp {
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin-top: -8px;
    margin-left: -8px;
    display: block;
    z-index: 101;
    border: solid 2px transparent;
    border-top-color: #158fd2;
    border-left-color: #158fd2;
    border-radius: 100%;
    -webkit-animation: load 900ms linear infinite;
    animation: load 900ms linear infinite;
  }
  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
