<template>
  <div class="kanban-board">
    <div
      class="kanban-column"
      v-for="(column, columnIndex) in columns"
      :key="column.id"
      @dragover.prevent="dragOver(columnIndex)"
      @drop="drop(columnIndex)"
      :class="{ 'drag-over': columnIndex === targetColumn }"
    >
      <h2>{{ column.title }}</h2>
      <div
        class="kanban-card"
        v-for="(card, cardIndex) in column.cards"
        :key="card.id"
        draggable="true"
        @dragstart="dragStart(card, columnIndex, cardIndex)"
        @dragenter.prevent="dragEnter(columnIndex, cardIndex)"
        :class="{ 'dragging': isDragging(card, columnIndex, cardIndex) }"
      >
        {{ card.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const columns = ref([]);

onMounted(async () => {
  const board = await frappe.call({
    method: 'frappe.client.get',
    args: {
      doctype: 'Kanban Board',
      name: 'Teacher Status',
    },
  });

  const ref_doctype = board.message.reference_doctype;  
  const columnsData = board.message.columns;
  const field_name = board.message.field_name;

  columnsData.forEach((column) => {
    columns.value.push({
      id: column.name,
      title: column.column_name,
      cards: [], // Initially, the cards are empty and will be populated in the next step
    });
  });

  for (const column of columnsData) {
    const cards = await frappe.call({
      method: 'frappe.client.get_list',
      args: {
        doctype: ref_doctype,
        filters: {
          [field_name]: column.column_name,
        },
      },
    });

    console.log(`Cards for column ${column.column_name}:`, cards.message);

    const columnIndex = columns.value.findIndex(col => col.id === column.name);
    if (columnIndex !== -1) {
      columns.value[columnIndex].cards = cards.message.map((card) => {
        console.log(`Fields available in card ${card.name}:`, card);
        return {
          id: card.name,
          title: card.name, // Change this to the correct field name
        };
      });
    }
  }
});





let draggedCard = null;
let draggedFromColumn = null;
let draggedFromIndex = null;
let targetColumn = null;
let targetIndex = null;

function dragStart(card, columnIndex, cardIndex) {
  draggedCard = card;
  draggedFromColumn = columnIndex;
  draggedFromIndex = cardIndex;
  targetColumn = null;
  targetIndex = null;
}

function dragEnter(columnIndex, cardIndex) {
  targetColumn = columnIndex;
  targetIndex = cardIndex;
}

function dragOver(columnIndex) {
  if (draggedFromColumn !== null && draggedFromIndex !== null) {
    targetColumn = columnIndex;
    targetIndex = null;
  }
}

function drop(columnIndex) {
  if (draggedCard) {
    if (targetIndex !== null && targetColumn === columnIndex) {
      columns.value[draggedFromColumn].cards.splice(draggedFromIndex, 1);
      columns.value[columnIndex].cards.splice(targetIndex, 0, draggedCard);
    } else {
      columns.value[draggedFromColumn].cards.splice(draggedFromIndex, 1);
      columns.value[columnIndex].cards.push(draggedCard);
    }
  }
  resetDragState();
}

function resetDragState() {
  draggedCard = null;
  draggedFromColumn = null;
  draggedFromIndex = null;
  targetColumn = null;
  targetIndex = null;
}

function isDragging(card, columnIndex, cardIndex) {
  return (
    draggedCard &&
    draggedCard.id === card.id &&
    draggedFromColumn === columnIndex &&
    draggedFromIndex === cardIndex
  );
}
</script>
