export const messages = (model = "") => ({
  success: {
    create: `${model} Created Successfully `,
    update: `${model} Updated Successfully `,
    delete: `${model} Deleted Successfully `,
  },
  failure: {
    create: `${model} Create Failed  `,
    update: `${model} Update Failed  `,
    delete: `${model} Delete Failed  `,
    notFound: `${model} Not Found `,
    alreadyExists: `${model} Already Exists `,
  },
  required: {
    file: "file is required",
  },
});
