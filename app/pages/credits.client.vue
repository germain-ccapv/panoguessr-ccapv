<script setup lang="ts">

</script>

<template>
  <div class="credit_container">
    <div class="homepage">
      <div class="home-title">Crédits</div>
      <div class="credit_content">
        <div class="subtitle">Dépôt Gitlab</div>
        <div class="content">Le dépôt Gitlab est à l'adresse suivante: <a href="https://gitlab.com/panoguessr/panoguessr.com">https://gitlab.com/panoguessr/panoguessr.com</a></div>
      </div>
      <div class="credit_content">
        <div class="subtitle">Licenses et crédits</div>
        <div class="content">Les licenses sont disponibles sur le dépôt, à l'adresse suivante: <a href="https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE">https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE</a></div>
      </div>
    </div>
    <AppButton>
      <a href="/">Retour</a>
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/global' as *;

.credit_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: 50px;
  margin-top: 20px;
  gap: 2rem;

  .homepage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    height: 100%;
    gap: 2rem;

    .home-title {
      font-family: "Neo Extra", sans-serif;
      font-size: 4rem;
      color: $white-color;
    }

    .credit_content {
      display: flex;
      flex-direction: column;
      width: 100%;

      .subtitle {
        font-family: "Neo Extra", sans-serif;
        font-size: 1.5rem;
        text-align: justify;
        line-height: 2.5rem;
        max-width: 85%;
      }

      .content {
        font-family: "Neo Medium", sans-serif;
        font-size: 0.85rem;
        color: $white-color;
        text-align: justify;
      }
    }
  }
}

</style>