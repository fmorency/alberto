import React from "react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@liftedinit/ui"
import { StepNames } from "./migration-form"
import { number } from "yup"

interface FormValues {
  assetAmount: number
  assetType: string
  accountAddress: string
}

interface AmountAssetStepProps {
  nextStep: (nextStep: StepNames) => void
  prevStep: (prevStep: StepNames) => void
  setFormData: (values: any) => void
  initialValues: FormValues
}

const assetTypes = ["MFX", "BITCH", "GRAY"] // TODO: Fetch this programmatically

const AmountAssetStepValidationSchema = Yup.object().shape({
  assetAmount: Yup.number()
    .positive()
    .max(1000, "Amount exceeds your holdings") // TODO: Fetch this programmatically
    .required("Required"),
  assetType: Yup.string().required("Required"),
})

export const AmountAssetStep = ({
  nextStep,
  prevStep,
  setFormData,
  initialValues,
}: AmountAssetStepProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AmountAssetStepValidationSchema}
      onSubmit={values => {
        setFormData(values)
        nextStep(StepNames.DESTINATION_ADDRESS)
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <FormControl
              isInvalid={!!(errors.assetAmount && touched.assetAmount)}
            >
              <FormLabel htmlFor="assetAmount">Asset Amount</FormLabel>
              <Field
                as={Input}
                id="assetAmount"
                name="assetAmount"
                type="number"
              />
              {errors.assetAmount && touched.assetAmount ? (
                <Text color="red.500">{errors.assetAmount}</Text>
              ) : null}
            </FormControl>

            <FormControl isInvalid={!!(errors.assetType && touched.assetType)}>
              <FormLabel htmlFor="assetType">Asset Type</FormLabel>
              <Field
                as={Select}
                id="assetType"
                name="assetType"
                placeholder="Select asset type"
              >
                {assetTypes.map((type, index) => (
                  <option key={index} value={type} disabled={type !== "MFX"}>
                    {type}
                  </option>
                ))}
              </Field>
              {errors.assetType && touched.assetType ? (
                <Text color="red.500">{errors.assetType}</Text>
              ) : null}
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => {
                setFormData({ userAddress: "" }) // TODO: Refactor this
                prevStep(
                  initialValues.accountAddress === ""
                    ? StepNames.ADDRESS
                    : StepNames.USER_ADDRESS,
                )
              }}
            >
              Back
            </Button>
            <Button mt={4} ml={2} colorScheme="blue" type="submit">
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}