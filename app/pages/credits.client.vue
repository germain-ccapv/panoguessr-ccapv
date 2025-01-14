<script setup lang="ts">

</script>

<template>
  <div class="credit_container">
    <div class="homepage">
      <div class="home-title">Crédits</div>
      <div class="credit_content">
        <div class="subtitle">Title 1</div>
        <div class="content">Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/styles/global';

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
