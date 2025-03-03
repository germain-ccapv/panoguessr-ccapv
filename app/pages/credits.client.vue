<script setup lang="ts">

</script>

<template>
  <div class="credit_container">
    <div class="homepage">
      <div class="home-title">Crédits</div>
      <div class="credit_content">
        <div class="content">La version initiale de PanoGuessr a été réalisée par Corentin Barbedette, Clément Guibout et Maxandre Rochefort (étudiants de l'IMT Atlantique), sur une idée originale de l'équipe <a href="https://panoramax.fr" target="_blank">Panoramax</a>.</div>
      </div>
      <div class="credit_content">
        <div class="subtitle">Code source</div>
        <div class="content">
          Le code source de PanoGuessr est disponible sous licence MIT sur ce <a href="https://gitlab.com/panoguessr/panoguessr.com">dépôt GitLab</a>.
        </div>
      </div>
      <div class="credit_content">
        <div class="subtitle">Licenses et crédits</div>
        <div class="content">
          Les détails sont présentés dans le <a href="https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE">fichier LICENSE du dépôt Gitlab</a>.
        </div>
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
  padding-inline: 50px;
  padding-top: 20px;
  gap: 2rem;

  @media screen and (max-width: 500px) {
    padding-inline: 20px;
  }

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

      @media screen and (max-width: 500px) {
        font-size: 3rem;
      }
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