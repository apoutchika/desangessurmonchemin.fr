import * as yup from 'yup';

export const donationSchema = yup.object({
  amount: yup
    .number()
    .typeError('Veuillez entrer un montant valide')
    .required('Le montant est requis')
    .min(1, 'Le montant minimum est de 1€')
    .max(999999, 'Wow! Contactez-nous directement pour un tel montant 😊'),
});

export type DonationFormData = yup.InferType<typeof donationSchema>;
