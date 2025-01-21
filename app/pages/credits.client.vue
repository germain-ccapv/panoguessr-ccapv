<script setup lang="ts">

</script>

<template>
  <div class="credit_container">
    <div class="homepage">
      <div class="back_container">
        <NuxtLink href="/"><AppButton>Menu</AppButton></NuxtLink>
      </div>
      <div class="home-title">Crédits</div>
      <div class="credit_content">
        <div class="subtitle">Dépôt Gitlab</div>
        <div class="content">Le dépôt Gitlab est à l'adresse suivante: <a href="https://gitlab.com/panoguessr/panoguessr.com">https://gitlab.com/panoguessr/panoguessr.com</a></div>
      </div>
      <div class="credit_content">
        <div class="subtitle">Licenses et crédits</div>
        <div class="content">Les licenses sont disponibles sur le dépôt, à l'adresse suivante: <a href="https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE">https://gitlab.com/panoguessr/panoguessr.com/-/blob/develop/LICENSE</a></div>
      </div>
      <div class="credit_content">
        <div class="subtitle">Musique et images</div>
        <div class="content">La musique et les images proviennent respectivement de <a href="https://suno.com/">Suno</a> et <a href="https://www.pixeltrue.com/license">Pixel True Studio</a>.<br> L'utilisation de ces contenus est libre de droits dans le cadre d'un usage non-commercial.</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/global';

a {
  overflow-wrap: anywhere;
}

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

    .back_container {
      display: flex;
      width: 100%;
      justify-content: start;
      align-items: center;
      gap: 1rem;
    }

    .home-title {
      font-family: "Neo Extra", sans-serif;
      font-size: 4rem;
      color: $white-color;

      @media screen and (max-width: 500px) {
        font-size: 2rem;
      }
    }

    .credit_content {
      display: flex;
      flex-direction: column;
      width: 100%;

      .subtitle {
        font-family: "Neo Extra", sans-serif;
        font-size: 1.75rem;
        text-align: justify;
        line-height: 2.5rem;
        max-width: 85%;

        @media screen and (max-width: 500px) {
          font-size: 1.5rem;
        }
      }

      .content {
        font-family: "Neo Medium", sans-serif;
        font-size: 0.9rem;
        color: $white-color;

        @media screen and (max-width: 500px) {
          font-size: 0.75rem;
        }
      }
    }
  }
}

</style>
