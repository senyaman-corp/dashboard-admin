<template>
    <div>
        <div class="form-group">
            <label class="form-label">Additional Charge</label>
            <select class="form-select form-select-lg mb-3" v-model="additional_name" @change="addAdditionalCharge(additional_name)">
                <option value="" selected>Select Additional Charge</option>
                <option v-for="charge in addChargesData" :key="charge.id" :value="charge.name">{{ charge.name }}</option>
            </select>
        </div>
        <div class="row" v-for="(charge,index) in additionalCharges" :key="index">
            <div class="col-md-4">
                <InputAutonumeric
                    v-model="additionalCharges[index].price"
                    label="Price"
                    required
                    placeholder="Masukkan Price" />
            </div>
            <div class="col-md-3">
                <InputBaseInput
                    type="number"
                    v-model="additionalCharges[index].qty"
                    label="Quantity"
                    required
                    placeholder="Input Quantity" />
            </div>
            <div class="col-md-4">
                <InputAutonumeric
                    type="number"
                    v-model="additionalCharges[index].discount"
                    label="Discount"
                    required
                    placeholder="Input Discount" />
            </div>
            <div class="col-md-1">
                <div class="mb-2">&nbsp;</div>
                <ButtonBaseButton
                    @click="removeAdditionalCharge(index)"
                    variant="danger"
                    type="button" class="mt-1">
                    <i class="fas fa-trash-alt"></i>
                </ButtonBaseButton>
            </div>

        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        addChargesData: {
            type: Array,
            required: true,
        },
    });
    const additional_name = ref("");
    const additionalCharges = ref([]);
    const emit = defineEmits(['update:additionalCharges']);
    
    const addAdditionalCharge = (name) => {
        let adDilter = additionalCharges.value.filter(itm => {
            return itm.name == name;
        });
        let adItemName = props.addChargesData.find(itm => {
            return itm.name == name;
        });
        if (name !== "" && adDilter.length == 0) {
            additionalCharges.value.push({
                name: name,
                price: adItemName.base_price,
                qty: 1,
                discount: adItemName.discount
            });
        }
    };
    const removeAdditionalCharge = (index) => {
        additionalCharges.value.splice(index, 1);
        //emit('update:additionalCharges', additionalCharges.value);
    };

    watch(
        () => additionalCharges.value,
        (newValue, oldValue) => {
            emit('update:additionalCharges', newValue);
        },
        { deep: true }
    );
    //const emit = defineEmits(['update:additionalCharges']);
</script>

<style>

</style>