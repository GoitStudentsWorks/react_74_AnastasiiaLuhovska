import { useDispatch, useSelector } from "react-redux";
import s from "./TransactionsList.module.css";
import {
  selectFilteredTransactions,
  selectIsDeleteModalOpen,
  selectIsLoading,
  selectTransactions,
} from "../../redux/transactions/selectors";
import clsx from "clsx";
import EditTransactionButtons from "../EditTransactionButtons/EditTransactionButtons";
import Modal from "react-modal";

import { useEffect, useState } from "react";
import TransactionModal from "../TransactionForm/TransactionModal";
import {
  closeDeleteModal,
  setSelectedType,
} from "../../redux/transactions/slice";
import { deleteTransaction } from "../../redux/transactions/operations";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import { Link, useParams } from "react-router-dom";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import getFormatedDate from "../../utils/getFormatedDate";
import { selectCurrency } from "../../redux/user/selectors";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const { transactionsType } = useParams();

  const transactions = useSelector(selectFilteredTransactions);
  const currency = useSelector(selectCurrency);
  const isLoading = useSelector(selectIsLoading);
  const isDeleteModalOpen = useSelector(selectIsDeleteModalOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  useEffect(() => {
    dispatch(setSelectedType(transactionsType));
  }, [dispatch]);

  const isTransactionsEmpty =
    !Boolean(useSelector(selectTransactions)[0]) && !isLoading;

  let emptyTransations = `Yo have not ${transactionsType} transactions yet`;

  let transactionForDelete = transactions.find(
    (transaction) => transaction._id === isDeleteModalOpen
  );

  return (
    <div className={s.tableWrapper}>
      <div className={s.tableInner}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.colCategory}>Category</th>
              <th className={s.colComment}>Comment</th>
              <th className={s.colDate}>Date</th>
              <th className={s.colTime}>Time</th>
              <th className={s.colSumm}>Sum</th>
              <th className={s.colActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction._id}>
                <td className={s.colCategory}>
                  {transaction.category.categoryName}
                </td>
                <td className={s.colComment}>{transaction.comment}</td>
                <td className={s.colDate}>
                  {getFormatedDate(transaction.date)}
                </td>
                <td className={s.colTime}>{transaction.time}</td>
                <td className={s.colSum}>
                  {transaction.sum} {getCurrencySymbol(currency)}
                </td>
                <td className={s.colActions}>
                  <EditTransactionButtons
                    transaction={transaction}
                    onEditClick={(t) => {
                      setSelectedTransaction(t);
                      setIsModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div className={s.loader}>
            <LoaderSpinner className={s.loader} />
          </div>
        )}
        {isTransactionsEmpty && (
          <div className={s.transactionEmptyPlug}>
            {emptyTransations}
            <Link className={s.addLink} to="/transactions/}">
              Add {transactionsType}
            </Link>
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(isDeleteModalOpen)}
        onRequestClose={() => dispatch(closeDeleteModal())}
        contentLabel={"Delete Transaction"}
        className={s.modal}
        overlayClassName={s.overlay}
      >
        {transactionForDelete && (
          <ul className={clsx(s.detailsList)}>
            <li className={clsx(s.deteilsItem, s.deteilsTitle)}>
              Delete transaction:
            </li>
            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Transaction type: </span>
              <span className={s.deleteContent}>
                {transactionForDelete.type}
              </span>
            </li>
            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Category: </span>
              <span className={s.deleteContent}>
                {transactionForDelete.category.categoryName}
              </span>
            </li>
            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Date: </span>
              <span className={s.deleteContent}>
                {getFormatedDate(transactionForDelete.date)}
              </span>
            </li>

            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Time:</span>
              <span className={s.deleteContent}>
                {transactionForDelete.time}
              </span>
            </li>
            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Comment:</span>
              <span className={s.deleteContent}>
                {transactionForDelete.comment}
              </span>
            </li>
            <li className={s.deteilsItem}>
              <span className={s.deleteTitle}>Sum:</span>
              <span className={s.deleteContent}>
                {transactionForDelete.sum} {getCurrencySymbol(currency)}
              </span>
            </li>
          </ul>
        )}
        <div className={s.btnContainer}>
          <button
            type="button"
            className={clsx(s.deleteBtn, s.modalBtn)}
            onClick={() =>
              dispatch(deleteTransaction({ _id: isDeleteModalOpen }))
            }
          >
            Delete
          </button>
          <button
            type="button"
            className={clsx(s.cancelBtn, s.modalBtn)}
            onClick={() => dispatch(closeDeleteModal())}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsList;
