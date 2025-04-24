//models
import Treatment from '../models/treatment.js';

export const getAllTreatments = async (req, res, next) => {
  const { dentistId, patientId } = req.sanitizedBody;
  if (!req.user || (req.user.role == 'assistant' && !dentistId))
    return res.status(400).json({ err: 'missing parameters' });
  try {
    const query =
      req.user.role === 'dentist'
        ? { dentist: req.user._id, patient: patientId }
        : req.user.role === 'patient'
          ? { patient: req.user._id }
          : { dentist: dentistId, patient: patientId };

    const treatments = await Treatment.find(query)
      .populate('patient', '-password')
      .populate('dentist', '-password');
    if (treatments.length == 0)
      return res
        .status(404)
        .json({ err: 'No Treatments found for this patient!' });

    return res.status(200).json({ treatments });
  } catch (err) {
    next(err);
  }
};

export const AddTreatment = async (req, res, next) => {
  const { name, description, startDate, endDate, patientId } = req.sanitizedBody;

  try {
    const treatment = await Treatment.create({
      name,
      description,
      startDate,
      endDate,
      dentist: req.user._id,
      patient: patientId,
    });

    return res.status(200).json({ message: 'treatment added', treatment });
  } catch (err) {
    next(err);
  }
};
